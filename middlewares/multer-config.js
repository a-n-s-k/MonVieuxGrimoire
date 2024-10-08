const multer = require("multer");
const path = require("path");


const whitelist = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

module.exports = (req, res, next) => { 
    
// Stockage des fichiers
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
        // Dossier de destination des images
		callback(null, "images");
	},
	filename: (req, file, callback) => {
        // Suppression des espaces dans le nom du fichier
        // Et leurs remplacements par des tirets
		const name = file.originalname.split(" ").join("_");
		callback(null, Date.now() + name);
	},
});


multer({ 
    storage: storage,
    // Filrage des images
    filter : (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!whitelist.includes(ext)) {
            return callback(new Error("Ce type de fichier n'est pas authorisé"));
        }
        callback(null, true);
    }  
 }).single("image");
}
