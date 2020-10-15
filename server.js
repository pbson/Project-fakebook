if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const app = express()

const bodyParser=require('body-parser');
app.use(bodyParser.json());

app.set("view engine", "ejs"); 

const indexRouter = require('./api/routes/index')
const userRouter = require('./api/routes/user')
const uploadsRouter = require('./api/routes/uploads')
const chatsocketRouter= require('./api/routes/chatsocket')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const db = mongoose.connection
db.on('error',error => console.log(error));
db.on('open',() => console.log('Connected to mongoose'));

app.use('/', indexRouter);
app.use('/it4788/user', userRouter);
app.use("/it4788/uploads", uploadsRouter);
app.use("/it4788/chatsocket", chatsocketRouter);


app.listen(process.env.PORT || 3000);
