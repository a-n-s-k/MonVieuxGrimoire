const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Répertoire de destination des fichiers
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0]; // On extrait le nom du fichier sans son extension
    const extension = path.extname(file.originalname); // On récupère l'extension d'origine (ex: .jpg, .png)
    callback(null, name + extension); // Conserve l'extension d'origine
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // Limite de taille de fichier à 4 Mo
  },
}).single("image");

// Middleware pour traiter les images
module.exports = (req, res, next) => {
  // Modifier les permissions du dossier "images" si nécessaire
  fs.chmod("images", 0o755, (err) => {
    if (err) {
      console.log(
        "Erreur lors de la modification des permissions pour le dossier `images`"
      );
      next(err);
      return;
    }

    // Appeler le middleware multer pour gérer le téléchargement du fichier
    upload(req, res, async (err) => {
      if (err) {
        console.log("Image supérieure à 4 Mo");
        const error = new Error(
          "L'image dépasse la taille maximale autorisée (4 Mo)."
        );
        error.statusCode = 400;
        next(error); // Passer au middleware suivant en cas d'erreur
        return;
      }

      try {
        const originalFileName = req.file ? req.file.path : null;

        if (originalFileName) {
          // Utiliser sharp pour redimensionner l'image sans changer son format d'origine
          const compressedFileName = req.file.path; // On garde le même nom de fichier

          await sharp(originalFileName)
            .resize(800) // Redimensionner à une largeur de 800px (hauteur ajustée automatiquement)
            .toBuffer((err, buffer) => {
              if (err) return next(err); // Gérer les erreurs

              // Remplacer le fichier original avec l'image redimensionnée
              fs.writeFile(compressedFileName, buffer, (err) => {
                if (err) {
                  console.log("Erreur lors de l'écriture du fichier compressé : ", err);
                  return next(err); // Passer l'erreur au middleware suivant
                }

                next(); // Passer au middleware suivant après la compression
              });
            });
        } else {
          next(); // Passer au middleware suivant si aucun fichier n'est téléchargé
        }
      } catch (error) {
        console.log("ERROR MULTER -- ", error);
        next(error);
      }
    });
  });
}