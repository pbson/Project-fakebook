const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
User_id : String,
Post_id : String,
Subject : String,
Details : String,
ReportedAt : Date
});

module.exports = mongoose.model('Report',reportSchema);