const multer = require("multer");
const sharp = require("sharp");
const fs = require("node:fs");
const { v4: uuidv4 } = require('uuid');



// Associe les types MIM des images à leurs extensions correspondantes
// Utilisés au début mais non conservés pour laisser apparaitre l'extension webp
 const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpeg",
   "image/png": "png",
   "image/webp": "webp",
 };


 function verifExtension(fichier) {
  const extension = fichier.originalname.split(".")[1];
  return extension;
}

//Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); //Repertoire de destination des fichiers
  },
  filename: (req, file, callback) => {
    //On définit comment les noms de fichier sont générées
    const extImage = file.originalname.split(".")[1];
    console.log(extImage);
    if (extImage === "jpg" || extImage === "jpeg" || extImage === "png" || extImage === "gif") {
    const imageName = file.originalname.split(".")[0]+".webp"
    callback(null, imageName );
    } else if (extImage === "webp"){
    const imageName = file.originalname;
    callback(null, imageName );
    } else {
      callback(null, false );
    }
    
    //callback(null, imageName );
  },
});


//Création d'un objet multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024, },
}).single("image");

//Export d'un middleware
module.exports = (req, res, next) => {
  //Pour vérifier s'il y'a une erreur lors de la modification des permissions du dossier "images"
  fs.chmod("images", 0o755, (err) => {
    if (err) {
      console.log(
        "Erreur lors de la modification des permissions pour le dossier `images`"
      );
      next(err);
      return;
    }

    //On appelle le middleware'multer (via upload) afin de gérer le telechargement du fichier
    upload(req, res, async (err) => {
      if (err) {
        console.log("Image supérieure à 4 Mo");
        const error = new Error("L'image dépasse la taille maximale autorisée (4 Mo).");
        // on passe au middleware suivant
        next(error, "Le poids de l'image est trop grand, il en faut de moins de 4 Mo"); 
        return;
      }
      try {
        if (req.file) {
            let originalImage = req.file.path;
          // si la requete contient un fichier et que tout se passe bien , 
          // on utilise sharp pour redimensionner et convertir l'image en format webp.
          const compressedFileName = req.file.path.split(".")[0];
          await sharp(originalImage)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(`${compressedFileName}`);
            // on renomme l'image compressée avec le nom de l'image d'origine
          fs.renameSync(`${compressedFileName}`,`${originalImage}`); 
        }
        // on passe au middleware suivant
        next(); 
      } catch (error) {
        console.log("ERROR MULTER -- ", error);
        next(error);
      }
    });
  });
};
