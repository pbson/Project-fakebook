const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    phonenumber: {
        type: String
    },
    password: {
        type: String
    },
    uuid: {
        type: String
    },
    token: {
        type: String
    },
    avatar: {
        type: String
    },
    latestLoginTime: {
        type: Date,
        dafault: Date.now
    },
    ListFriends: Array,
    FriendsRequest : Array ,
    Req: Array,
    locked : Number
});

module.exports = mongoose.model('User', userSchema);