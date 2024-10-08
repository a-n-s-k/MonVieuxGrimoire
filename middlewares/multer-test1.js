const multer = require("multer");
const sharp = require("sharp");
const fs = require("node:fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { randomChars } = require("./../utils/utilitaires");

/* var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../images/');
    },
    filename: function (req, file, cb) {
      var id = util.random_string(16) + Date.now() + path.extname(file.originalname);
      cb(null, id);
    }
  });
  var upload = multer({ storage: storage }).single('image');
  
  router.post('/image/', function (req, res) {
    upload(req, res, function (err) {
      if (err){
        console.log(JSON.stringify(err));
        res.status(400).send('fail saving image');
      } else {
        console.log('The filename is ' + res.req.file.filename);
        res.send(res.req.file.filename);  
      }
    });
  }); */


/*   const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}; */

// This is based upon doubletap's answer, 
// this one handles any length of random required characters (lower only),
// and keeps generating random numbers until enough characters have been collected.

  


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: (req, file, callback) => {
        //const id = util.random_string(16) + Date.now() + path.extname(file.originalname);
        const id = uuidv4() + path.extname(file.originalname);
      //const name = file.originalname.split('.').join('_');
      //const extension = MIME_TYPES[file.mimetype];
      callback(null, id);
    }
});

const uploadImage = multer({storage: storage}).single('image');

module.exports = (req, res) => {
    uploadImage(req, res, function (err) {
      if (err){
        console.log(JSON.stringify(err));
        res.status(400).send('fail saving image');
      } else {
        console.log('The filename is ' + res.req.file.filename);
        res.send(res.req.file.filename);  
      }
    });
}




//const uploadImage = multer({storage: storage}).single('image');




//module.exports = uploadImage;
