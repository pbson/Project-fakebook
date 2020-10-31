if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const fileUpload = require('express-fileupload');

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(fileUpload());

app.set("view engine", "ejs"); 
app.use(express.static(__dirname + '/public/'));

server.listen(process.env.PORT || 3000);
io = require('socket.io')(server,{'pingTimeout':200000});
var path = __dirname;
// export it
const indexRouter = require('./api/routes/index')
const userRouter = require('./api/routes/user')
const postRouter = require('./api/routes/post')
const commentRouter = require('./api/routes/comment')
const uploadsRouter = require('./api/routes/uploads')
const chatsocketRouter= require('./api/routes/chatsocket')
const chatsocketController= require('./controller/chatController')(io)
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const db = mongoose.connection
db.on('error',error => console.log(error));
db.on('open',() => console.log('Connected to mongoose'));

app.use('/', indexRouter);
app.use('/it4788/user', userRouter);
app.use('/it4788/post', postRouter);
app.use('/it4788/comment', commentRouter);
app.use("/it4788/uploads", uploadsRouter);
app.use("/it4788/chatsocket", chatsocketRouter);
exports.path = path;
