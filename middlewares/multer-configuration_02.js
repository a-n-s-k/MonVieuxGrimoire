const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Répertoire de destination des fichiers
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0]; // On extrait le nom du fichier sans son extension
    callback(null, name + ".webp"); // Conversion directe en .webp
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
}).single("image");

module.exports = (req, res, next) => {
  fs.chmod("images", 0o755, (err) => {
    if (err) {
      console.log(
        "Erreur lors de la modification des permissions pour le dossier `images`"
      );
      next(err);
      return;
    }

    upload(req, res, async (err) => {
      if (err) {
        console.log("Image supérieure à 4 Mo");
        const error = new Error(
          "L'image dépasse la taille maximale autorisée (4 Mo)."
        );
        error.statusCode = 400;
        next(error);
        return;
      }

      try {
        const originalFileName = req.file ? req.file.path : null;

        if (originalFileName) {
          // Utiliser sharp pour convertir l'image sans créer de fichier temporaire
          const buffer = await sharp(originalFileName)
            .resize(800)
            .webp({ quality: 80 })
            .toBuffer();

          // Remplacer le contenu du fichier original par le buffer compressé
          fs.writeFile(originalFileName, buffer, (err) => {
            if (err) {
              console.log("Erreur lors de l'écriture du fichier compressé : ", err);
              next(err);
            } else {
              next(); // Passer au middleware suivant
            }
          });
        } else {
          next(); // Si aucun fichier n'est téléchargé
        }
      } catch (error) {
        console.log("ERROR MULTER -- ", error);
        next(error);
      }
    });
  });
};
