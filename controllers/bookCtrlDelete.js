const Book = require('./../models/Book');
const fs = require("node:fs");

// Suppression d'un livre
exports.deleteOneBook = (req, res, next) => {
  // Récupération de l'ID du livre à supprimer
  Book.findOne({ _id: req.params.id })
      .then(book => {
          // Vérification de l'appartenance de la fiche
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message: 'unauthorized request' });
          } else {
              // Séparation du nom du fichier image du chemin
              const filename = book.imageUrl.split('/images/')[1];
              // Suppression du fichier image 
              fs.unlink(`images/${filename}`, () => {
                // Suppression du livre dans la base de données
                  Book.deleteOne({ _id: req.params.id })
                      .then(() => { res.status(200).json({ message: 'Le livre est supprimé.' }) })
                      .catch( () => {res.status(400).json({ error: 'Erreur lors de la suppression du livre.' })});
              });
          }
      })
      .catch( error => {
          res.status(404).json({ error });
      });
};