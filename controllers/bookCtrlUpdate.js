const Book = require('./../models/Book');
const fs = require("node:fs");

exports.updateOneBook = (req, res, next) => {
  let book = Book.findOne({ _id: req.params.id })
  .then((book) => { 
    if (req.file) {
      const filename = book.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }
  })
  .catch(() => res.status(400).json({ error: "Erreur lors de la suppression de l'image." }));
    const reqBody = req.body;
    const reqFile = req.file;
    const bookFiche = reqFile? 
    { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} :
    { ...reqBody };

  Book.updateOne({ _id: req.params.id }, {...bookFiche, _id: req.params.id})
  .then(() => {
    res.status(200).json({ message: "La fiche livre a été modifiée avec succes." })
  })
  .catch(() => res.status(400).json({ error: "Erreur lors de la mise à jour de la fiche livre."}));
}