const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
Sender:String,
Receiver:String,
Unread:Boolean,
CreatedAt:Date,
Content:String,
IdConversation:String
});

module.exports = mongoose.model('Message',messageSchema);