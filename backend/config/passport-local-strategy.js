const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User =require('../models/user');


passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email,password,done){
        User.findOne({email:email})
     
        .then((user)=>{
                if(!user ||user.password != password){
                    // req.flash('success','post published!');

                    
                    return done(null,false);
                } 
                
                    return done(null,user);
                
            })
            .catch((err) => {

                    return done(err);
                  });
        
    }


));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});
//deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id)
     
    .then((user)=>{
           return done(null,user);
        })
        .catch((err) => {
                console.log("Error in finding the user ----> passport ");
                return done(err);
              });
});

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}


module.exports=passport;