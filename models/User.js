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
    }
});

module.exports = mongoose.model('User', userSchema);