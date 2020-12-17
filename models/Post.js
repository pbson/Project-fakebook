const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const postSchema = mongoose.Schema({
User_id : String,
Described:String,
Status:String,
Image : Array,
Video : Array,
Like : Array,
Comment : Array,
CreatedAt : Date,
UpdatedAt: Date,
Report : Array
});

postSchema.index({Status: 'text'});
module.exports = mongoose.model('Post',postSchema); 