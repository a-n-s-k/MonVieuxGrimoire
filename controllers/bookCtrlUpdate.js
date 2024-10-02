const Book = require('../models/Book');

exports.updateOneBook = (req, res, next) => {
    if (req.file) {
      req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
  
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'La fiche du livre est modifiée' }))
    .catch(error => res.status(400).json({ error }));
}

