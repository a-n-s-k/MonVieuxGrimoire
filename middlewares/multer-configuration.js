const multer = require('multer');
const sharp = require('sharp');

/* const storage = multer.memoryStorage();

const upload = multer({
    storage
});

const resizeAndSaveImage = async (req, res, next) => {
    try {
        const timestamp = Date.now();
        const filename = `${timestamp}-${req.file.originalname}`;
        req.file.filename = filename;
        await sharp(req.file.buffer)
            .resize({ width: 290, height: 290 })
            .toFile(`./images/${filename}`);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    resizeAndSaveImage
};
 */



const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
  });
  
  module.exports = multer({storage: storage}).single('image');