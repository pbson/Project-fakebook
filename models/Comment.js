
const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    Poster:String,
    CreatedAt:{
        type: Date,
        dafault: Date.now
    },
    Comment:String,
    PostID: String
});

module.exports = mongoose.model('Comments', commentSchema);