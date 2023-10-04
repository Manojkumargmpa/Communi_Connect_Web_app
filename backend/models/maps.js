const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({

   pincode:{
    type:String,
required:true,
   },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    radius: {
        type: Number,
        required: true,
    },
    description:{
        type:String,
        required:true,
    }
}, {
    timestamps: true,
});

const Markers = mongoose.model('Markers', mapSchema);
module.exports = Markers;
