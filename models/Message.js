const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
Sender:String,
Receiver:String,
Unread:Boolean,
CreatedAt:{
    type: Date,
    dafault: Date.now
},
Content:String,
IdConversation:String
});

module.exports = mongoose.model('Message',messageSchema);