const mongoose = require('mongoose')

const deviceTokenSchema = mongoose.Schema({
UserId : String,
DeviceToken: String
});

module.exports = mongoose.model('DeviceToken',deviceTokenSchema); 