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
    // On change le nom et l'extension du fichier
    const name = uuidv4()+".webp";
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
        const chemin = "images/\/";
        let originalFileName = req.file ? chemin+req.file.filename : null;
        let compressedFileName = req.file ? originalFileName.split(".")[0]+"-compressed.webp" : null;
        if (originalFileName) {
          await sharp(originalFileName)
          .resize({ height: 728 })
          .webp({ quality: 80 })
          .toFile(`${compressedFileName}`);
          fs.renameSync(`${compressedFileName}`, `${originalFileName}`);
        }
        next();
    } catch (error) {
      console.log("Erreur du middleware multer", error);
      next(error);
    }
    });
  });
};