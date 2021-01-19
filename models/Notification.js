const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    user_id: String,
    type: String,
    object_id: String,
    title: String, 
    created:{
        type: Date,
        dafault: Date.now
    },    
    avatar: String,
    group: Number,
    read : Boolean 
});

module.exports = mongoose.model('Notification', notificationSchema);