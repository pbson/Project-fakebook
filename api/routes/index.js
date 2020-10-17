const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('hello world')
})
router.get('/chat', (req,res)=>{
    res.render("../views/chat")
})
module.exports = router