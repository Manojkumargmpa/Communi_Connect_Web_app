const express = require('express');
const path = require('path');
const cors = require("cors");
const db = require('./config/mongoose');
const port = 8004;
const session= require('express-session');
const passport=require('passport');
const passportLocal =require('./config/passport-local-strategy');
const usersController=require('./controllers/users_controller');
const MongoStore = require('connect-mongo')(session);

const app=express();
app.use(express.json());
const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
const User = require("./models/user");
const Announcements=require("./models/announcements");
const Post=require("./models/posts");

app.use(cors());
app.use(session({
    name:'codeial',
    secret:'xyz',
    saveUninitialized:false,
    resave:false,
    cookie :{
        maxAge:(1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoremove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.get('/announcements/after/:date', async (req, res) => {
  const { date } = req.params;
console.log(date);
console.log("made api req to after date");
  try {
      const announcements = await Announcements.find({ createdAt: { $gte: new Date(date) } });
      res.json(announcements);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching announcements' });
  }
});
app.get("/auth-success", (req, res) => {
  const jsonDataEncoded = req.query.data;
  const jsonData = JSON.parse(decodeURIComponent(jsonDataEncoded));
 // console.log("Received JSON data:", jsonData);
 //if(datafrombackend.authstatus==1) {datafrombackend={...jsonData};}
 
  res.json(jsonData);
  // Now, you can use the jsonData object in your route logic
 
 // res.send("Data received successfully!");
});
// app.get("/get-auth-status",(req,res)=>{


// })
app.get("/api/maps",function(req,res){
  res.sendFile(path.join(__dirname, 'index.html'));
})
app.get("/gett",function(req,res){
    res.send("running!!!");
    //console.log(req);
});

app.get('/api/announcements', async (req, res) => {
  try {

    const query = {};
    const facts = await Announcements.find(query);
//console.log(facts);
console.log("logging facts");
    res.json(facts);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'An error occurred while fetching facts.' });
  }
});

app.post('/api/announcements',async(req,res)=>{
  const {announcement,pincode}=req.body;
  const NewAnnouncement=new Announcements({
  announcement,
  pincode
  });
  await NewAnnouncement.save();
})


app.get('/api/posts', async (req, res) => {
    try {
  
      const query = {};
      const posts = await Post.find(query);
  //console.log(facts);
  console.log("logging posts");
      res.json(posts);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'An error while fetching posts.' });
    }
  });
  
  app.post('/api/posts',async(req,res)=>{
    const {username,content}=req.body;
    const NewPost=new Post({
        username,
        content
    
    });
    await NewPost.save();
  })








app.get('/data', (req, res) => {
    const data = { key: 'valueees' };
    res.json(data);
  });



const create = async (req, res) => {
    console.log("HH");
    try {
      if (req.body.password !== req.body.confirm_password) {
        return res.status(400).json({ message: "Password and confirm_password do not match" });
      }
  
      const existingUser = await User.findOne({ email: req.body.email });
  
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
  
      const newUser = new User({
        name: req.body.user_name,
        email: req.body.email,
        pincode: req.body.pincode,
        password: req.body.password,
      });
      console.log("User created");

      await newUser.save(); // Save the new user to the database
  
      console.log("User created");
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error in user creation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


// createSession = async function (req, res) {
//     try {
//       // Step 1: Find the user
//       const user = await User.findOne({ email: req.body.email });
        
//       // Handle user not found
//       if (!user) {
//         //return res.redirect('back');
//         console.log("invalid user");
//       }
  
//       // Step 2: Handle password check
//       if (user.password !== req.body.password) {
//         console.log("invalid user");
//         //return res.redirect('back');
//       }
  
//       // Step 3: Handle session creation
//       res.cookie('user_id', user.id);
//     //   return res.redirect('/users/profile');
//     console.log("heyy hiii");
//     } catch (err) {
//       console.log('Error in creating session:', err);
//       return res.redirect('back');
//     }
//   };
  


  app.post('/create-session',passport.authenticate(
    'local'
),usersController.createSession);



  app.post('/create', async (req, res) => {
    try {
      console.log(req.body); // Log the request body
      await create(req, res); // Call the create function to create the user
    //  res.status(200).json({ message: 'Data received and user created successfully' }); // Respond to the client
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
/*
  app.post('/create-session', async (req, res) => {
    try {
       
      await createSession(req, res); // Call the create function to create the user
      console.log("hey");
    //  res.status(200).json({ message: 'Data received and user created successfully' }); // Respond to the client
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

*/

app.get("/signout",usersController.destroySession);
  
app.listen(port,function (err){
    if(err){
        console.log("error in running the server",error);
    }
    else{
        console.log("running!!");
    }
})