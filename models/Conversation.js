const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
    UserList : Array ,
    MessageList: Array,
    LastMessage:Date
});

module.exports = mongoose.model('Conversation', conversationSchema);