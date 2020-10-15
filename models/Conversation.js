const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
    UserList : Array ,
    MessageList: Array,
});

module.exports = mongoose.model('Conversation', conversationSchema);