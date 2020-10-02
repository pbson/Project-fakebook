const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require('path');
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// Init gfs
let gfs;
mongoose.connection
  .once('open', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo)
    gfs.collection('uploads')
  })

//Create a storage engine

const storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

//@route GET /
//@desc Loads form
router.get('/', (req,res) => {
    console.log(req.hostname)
    console.log(req.get('host'))
    console.log(req.headers.host + '/it4788/uploads/image/6121b696d5b99ae63c4f2c6db22a4ec7.png')
    res.render('uploads');
})

//@route POST /
//@desc Loads form
router.post('/', upload.single('file'), (req,res) => {
    // res.json({file: req.file})
    res.redirect('/it4788/uploads')
})

//@route GET /files
//@desc Display single file in JSON
router.get('/files/:filename',(req,res) => { 
    gfs.files.findOne({filename: req.params.filename}, (err,file) => {
        //check if files
        if(!file || file.length === 0){
            return res.status(404).json({
                err: 'No files exists'
            })
        }

        //Files exist
        return res.json(file);
    })
})

//@route GET /files
//@desc Display Image
router.get('/image/:filename',(req,res) => { 
    gfs.files.findOne({filename: req.params.filename}, (err,file) => {
        //check if files
        if(!file || file.length === 0){
            return res.status(404).json({
                err: 'No files exists'
            })
        }

        //Check if image
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
            //Read output to browser
            let readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }else{
            res.json({
                err: "Not an image"
            })
        }
    })
})

module.exports = router;
