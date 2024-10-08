//***********Middleware pour gérer le telechargement d'images*******

//Import des modules necessaires
const multer = require("multer"); //Module pour la gestion des fichiers
const sharp = require("sharp"); //Module pour manipuler les images
const fs = require("fs"); //Pour réaliser des opérations sur les fichiers

//Associe les types MIM des images à leurs extensions correspondantes:Utilisés au début mais non conservés pour laisser apparaitre l'extension webp
const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
   "image/webp": "webp",
};

//const storage.filename.extension = MIME_TYPES[file.mimetype];

//Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); //Repertoire de destination des fichiers
  },

  filename: (req, file, callback) => {
    //On définit comment les noms de fichier sont générées.Définit repertoire de destination + nom fichier
    const name = file.originalname.split(".")[0]; //On extrait le nom du fichier sans son extension
    console.log(name);
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name +'.' + extension);
    //callback(null, name + ".webp");
  },
});

//const { filename } = storage;

//const { name, extension } = filename;


//console.log(storage);
//console.log(extension);


//Création d'un objet multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
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
        const error = new Error(
          "L'image dépasse la taille maximale autorisée (4 Mo)."
        );
        error.statusCode = 400;
        next(error); // on passe au middleware suivant
        return;
      }

      try {
        const originalFileName = req.file ? req.file.path : null;
        console.log(originalFileName);

        const uncompressedFileName = req.file.path.split(".")[0] + "-original."+ req.file.mimetype.split("/")[1];

        console.log(uncompressedFileName);

        fs.copyFile(
          `${originalFileName}`,
           `${uncompressedFileName}`,
          (err) => {
            if (err) {
              console.log("Opération de copie échouée: ", err);
            }
            else {
            console.log(`Fichier ${originalFileName} copié vers ${uncompressedFileName}`,
              //fs.readFileSync(`${uncompressedFileName}`, "utf8")
              );
            }
          }
        );


        //if (originalFileName) {
          // si la requete contient un fichier et que tout se passe bien , on utilise sharp pour redimensionner et convertir l'image en format webp.
          //const compressedFileName = req.file.path.split(".")[0] + "-compressed.webp";
         





            //req.file.path.split(".")[0];
            /* fs.copyFile(`${originalFileName}`, `${uncompressedFileName}`, error => {
              console.log('La source media was not copied to original media')
             }); */

/*           await sharp(originalFileName)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(`${compressedFileName}`);
            console.log(originalFileName); */

  const imageLivre = {



            if (originalFileName) {
          //fs.unlink(`${originalFileName}`); // on supprime l'image d'origine
          //fs.rename(`${compressedFileName}`, `${originalFileName}`); // on renomme l'image compressée avec le nom de l'image d'origine



          // on supprime l'image d'origine
          /* await fs.unlink(
            `${originalFileName}`,
                (err) => { err? console.log(err) : console.log(`Fichier supprimé: ${originalFileName}`);}
          ); */

          // on renomme l'image compressée avec le nom de l'image d'origine
          const compressedFileName = req.file.path.split(".")[0] + ".webp";
          sharp(originalFileName)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(`${compressedFileName}`)
         {
              fs.rename(
                `${originalFileName}`,
                `${compressedFileName}`,
                () => {
                      console.log(`Fichier ${originalFileName} renommé en ${compressedFileName}`);
              });
            };
/* 
          fs.rename(
            `${originalFileName}`,
            `${compressedFileName}`,
            () => {
                  console.log(`Fichier ${originalFileName} renommé en ${compressedFileName}`);
          }); */
          }
        //}
      }
        next(); // on passe au middleware suivant
      } catch (error) {
        console.log("ERROR MULTER -- ", error);
        next(error);
      }
    });
  });
};
