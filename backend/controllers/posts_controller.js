
const Post = require('../models/posts');
const fs = require('fs');
const path =  require('path');
module.exports.update = function(req,res){
   
    Post.findOneAndUpdate({_id:req.params.id},req.body)
        .then((post)=>{
            Post.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("Multer error",err);
                }
                post.name = req.body.name;
                post.email = req.body.email;
                if(req.file){
                    if(post.avatar){
                        //replacing the old picture with the current updated one
                        fs.unlinkSync(path.join(__dirname,'..',post.avatar));
                    }
                    // saving files path into avatar field of the user
                    post.avatar = Post.avatarPath + '/' + req.file.filename;
                }
                post.save();
                // return res.redirect('back');

            });

            return res.redirect('back');
        })
        .catch((err) => {
            console.log('Error updating user:', err);
            return res.status(500).send('Internal Server Error');
        });
    
  
}