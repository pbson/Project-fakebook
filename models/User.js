const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
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
    cover_image: String,
    address: String,
    city: String, 
    listing: String,
    online: String,
    description: String,
    created: String,
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