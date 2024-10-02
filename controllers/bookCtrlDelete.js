const Book = require('../models/Book');


exports.deleteOneBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Le livre est supprimé.' }))
    .catch(error => res.status(400).json({ error: 'Erreur lors de la suppression du livre.' }));
}
