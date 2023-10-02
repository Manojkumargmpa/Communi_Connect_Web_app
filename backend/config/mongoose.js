const mongoose = require('mongoose');
/*
mongoose.connect('mongodb://127.0.0.1:27017/communi', {
    useNewUrlParser: true,
  });
*/
mongoose.connect('mongodb+srv://tejeswarreddysunkugari03:dbatlas200339@cluster0.lkcuxyy.mongodb.net/communiconnectwebapp');



const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;