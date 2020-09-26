if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error',error => console.log(error));
db.on('open',() => console.log('Connected to mongoose'));


app.use('/', indexRouter);

app.listen(process.env.PORT || 3000);
