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
const nodemailer = require('nodemailer');
const app=express();
app.use(express.json());
const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
const User = require("./models/user");
const Announcements=require("./models/announcements");
const Post=require("./models/posts");
const Markers=require("./models/maps");
const dotenv = require('dotenv'); // Load dotenv package

dotenv.config();
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
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:  process.env.SMTP_EMAIL,
    pass:  process.env.SMTP_PASSWORD,
  },
});

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
// console.log("logging facts");
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
  const mailOptions = {
    from: 'webdevteam32023@gmail.com',
    subject: 'Announcement',
    text: announcement,
  };
  const query = {};
  //console.log("about to savecweweqw")
  const users = await User.find(query);
 // console.log(users);
 //  console.log("about to send");
  users.forEach((user) => {
    mailOptions.to = user.email;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error sending email to ${user.email}: ${error.message}`);
      } else {
        console.log(`Email sent to ${user.email}: ${info.response}`);
      }
    });
  });
})

app.post('/api/addMarker',async(req,res)=>{
  const {description,latitude,longitude,radius,pincode}=req.body;
  const newMarker=new Markers({
    description,
    latitude,
    longitude,
    radius,
    pincode
  })
  //console.log("description ",descritpion);
  //console.log("in posting marker",req.body);

  await newMarker.save();
})
//router.post('/postimage',passport.checkAuthentication,usersController.update);
app.get('/api/getMarker', async (req, res) => {
  try {
    console.log("received get marker request");
    const pincode = req.query.pincode;
    let query = {pincode};
  

    const facts = await Markers.find({});
   // console.log(facts);
    res.json(facts);
  } catch (error) {
    console.error('Error fetching facts:', error);
  
  }
});

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
  const multer=require('multer');
  let storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'../frontend/src/images');
    },
    filename: function (req,file,cb) {
        //file.fieldname is avatar
        cb(null,file.fieldname + '-' +Date.now());
    }
});
  const upload = multer({storage:storage});

  app.post('/api/posts',upload.single("avatar"),async(req,res)=>{
    const {formData}=req.body;
    console.log("heyyyyy",req.file.filename);

    const NewPost=new Post({
        "username":req.body.username,
        "content":req.body.content,
        "avatar":req.file.filename,
      
    
    });
    await NewPost.save() .then((savedDocument) => {
      console.log('Document saved successfully:', savedDocument);
    })
    .catch((error) => {
      console.error('Error saving document:', error);
    });
  
  
  
  
  
  ;
  })

  // app.post("/upload-image",upload.single("image"),async(req,res)=>{
  //   res.send("uploaded");
  // });






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

/*
createSession = async function (req, res) {
    try {
      // Step 1: Find the user
      const user = await User.findOne({ email: req.body.email });

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
  

      // Step 3: Handle session creation
      res.cookie('user_id', user.id);
    //   return res.redirect('/users/profile');
    console.log("heyy hiii");
    } catch (err) {
      console.log('Error in creating session:', err);
      return res.redirect('back');
    }
  };
  */



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