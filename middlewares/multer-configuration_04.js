const multer = require('multer');
const sharp = require('sharp');
const fse = require("fs-extra");



/* const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}; */
  
/* const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split('.').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
}); */








//Associe les types MIM des images à leurs extensions correspondantes:Utilisés au début mais non conservés pour laisser apparaitre l'extension webp
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

//Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
 destination: (req, file, callback) => {
   callback(null, "images"); //Repertoire de destination des fichiers

   fs.chmod("images", 0o755, err => {
    if (err) {
      console.log(
        "Erreur lors de la modification des permissions pour le dossier `images`"
      );
      next(err);
      //return;
    }
  });
 },

 filename: (req, file, callback) => {
   //On définit comment les noms de fichier sont générées.Définit repertoire de destination + nom fichier
   const name = file.originalname.split(".")[0]; //On extrait le nom du fichier sans son extension
   const extension = MIME_TYPES[file.mimetype];
   callback(null, name +'-'+ Date.now() + '.' + extension);
   //callback(null, name + ".webp");
 },
});

//Création d'un objet multer
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 }
}).single("image");


if (uploadImage) {
module.exports = (req, res, next) => {
/* // Async with callbacks:
fs.copy('/tmp/myfile', '/tmp/mynewfile', err => {
  if (err) return console.error(err)
  console.log('success!')
}) */

  uploadImage(req, res, async (err) => {
/*       if (err) {
        console.log("L'image dépasse la taille maximale autorisée de (4 Mo).");
      next(err);
      } */

      try {
        const originalFileName = req.file ? req.file.path : null;

        console.log(originalFileName);

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
}

} else {
  console.log("L'image dépasse la taille maximale autorisée de (4 Mo).");
}


