const multer = require("multer");
const sharp = require("sharp");
const fs = require("node:fs");
const { v4: uuidv4 } = require('uuid');

//Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); //Repertoire de destination des fichiers
  },

  filename: (req, file, callback) => {
    // On définit comment les noms de fichier sont générées
    // On change le nom du fichier
    // const name = uuidv4()+".webp"; 
    const name = uuidv4()+".webp";
    // On change l'extension du fichier
    //callback(null, name + ".webp");
    callback(null, name);
  },
});

// Création d'un objet multer
const upload = multer({
  storage: storage,
  // On limite la taille de l'image chargée
  limits: { fileSize: 4 * 1024 * 1024, },
}).single("image");

// Export du middleware
module.exports = (req, res, next) => {
  //Pour vérifier s'il y'a une erreur lors de la modification des permissions du dossier "images"
  fs.chmod("images", 0o755, (err) => {
    if (err) {
      console.log( "Erreur lors de la modification des permissions pour le dossier 'images'");
      next(err);
      return;
    }
    // On appelle le middleware multer pour gérer le telechargement du fichier
    upload(req, res, async (err) => {
      if (err) {
        console.log("Votre image ne doit pas avoir un poids supérieur à 4 Mo.");
        const error = new Error("L'image dépasse le poids maximal autorisé qui est de 4 Mo.");
        error.statusCode = 400;
        next(error);
        return;
      }
      try {
        
        // On recupère ici l'extension de l'image de départ
        //const ext = req.file.split(".")[1];
        // On recupère ici l'image de départ et son chemin
        const chemin = "images/\/";
        let originalFileName = req.file ? chemin+req.file.filename : null;
        console.log(originalFileName);
        let compressedFileName = req.file ? originalFileName.split(".")[0]+"-compressed.webp" : null;
        console.log(compressedFileName);
        console.log(req.file);

        if (originalFileName) {
          // si la requete contient un fichier et que tout se passe bien
          // on utilise sharp pour redimensionner et convertir l'image en format webp.
          await sharp(originalFileName)
            .resize({
              width: 824,
              height: 1040,
              fit: sharp.fit.cover,
              position: sharp.strategy.entropy
            })
            .webp({ quality: 80 })
            //.toFile(compressedFileName);

            .toFile(`${compressedFileName}`);
            console.log(compressedFileName);
            //fs.rmSync(`${originalFileName}`);
            console.log(originalFileName);
            fs.renameSync(`${compressedFileName}`, `${originalFileName}`);
            console.log(originalFileName);
        }
        next();
      } catch (error) {
        console.log("Erreur du middleware multer", error);
        next(error);
      }
    });
  });
};