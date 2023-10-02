const mongoose = require('mongoose');
const multer = require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');
const postSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    content: {
        type:String,
        required:true
    },
    avatar: {
        type:String,
    }


},{
    timestamps: true
});


//postSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar');
postSchema.statics.avatarPath = AVATAR_PATH; 

const Post = mongoose.model('post',postSchema);
module.exports = Post;