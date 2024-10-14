const Book = require('../models/book-models');
const fs = require("node:fs");

// CREATE: Creation d'une fiche livre
exports.postOneBook = (req, res, next) => {
  const bookReqBody = JSON.parse(req.body.book);
  delete bookReqBody._id;
  delete bookReqBody._userId;
  const oneBook = new Book({
    ...bookReqBody,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  oneBook.save()
  .then(() => { res.status(201).json({ message: 'Fiche livre créé.' }) })
  .catch(error => { res.status(400).json({ error: 'Erreur de création de la fiche livre.' }) })
}

// CREATE : Creation d'une note et mis à jour de note
exports.postOneBookRate = (req, res, next) => {
  const bookId = req.params.id;
  const { rating, userId } = req.body;
  Book.findOneAndUpdate(
    { _id: bookId },
    { $push: { ratings: { userId, grade: rating } } },
    { new: true }
  )
  .then((updatedBook) => {
    if (!updatedBook) {
      return res.status(404).json({ message: "Erreur lors de la notation du livre." });
    }
    const ratings = updatedBook.ratings.map((rate) => rate.grade);
    const newAverageRating = ratings.reduce((sum, grade) => sum + grade, 0) / ratings.length;
    updatedBook.averageRating = newAverageRating;
    updatedBook
    .save()
    .then((savedBook) => {
      res.status(200).json(savedBook);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
}

// READ : Lecture et affichage de tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error =>  res.status(400).json({ error: error.message }));
}

// READ : Lecture et affichage d'un livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error: error.message }));
}

// READ : Lecture et affichage des 3 livres les mieux notés
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => { res.json(books) })
    .catch(error => res.status(400).json({ error: error.message }));
}

// UPDATE : Mise à jour de livre
exports.updateOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then((book) => { 
    const reqBody = req.body;
    const reqFile = req.file;
    const bookFiche = reqFile? 
    { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} :
    { ...reqBody };
    // Vérification de l'appartenance de la fiche
    if (book.userId != req.auth.userId) {
      res.status(403).json({ message: 'unauthorized request' });
    } else {
    // Séparation du nom du fichier image du chemin
      const filename = book.imageUrl.split('/images/')[1];
      // Suppression du fichier image précédent
      fs.unlink(`images/${filename}`, () => {
        // Mise à jour du livre dans la base de données
        Book.updateOne({ _id: req.params.id }, {...bookFiche, _id: req.params.id})
        .then(() => { res.status(200).json({ message: "La fiche livre a été modifiée avec succes." })})
        .catch(() => {res.status(400).json({ error: "Erreur lors de la mise à jour de la fiche livre." })});
      });
    }
  })
  .catch( error => res.status(404).json({ error }));
}

// DELETE: Suppression de livre
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
        // .then(() => { res.status(200).json({ message: 'Le livre est supprimé.' }) })
        .then(() => { res.status(200).json({ message: "La fiche livre a bien été supprimée"})})
        .catch(() => {res.status(400).json({ error: 'Erreur lors de la suppression du livre.' })});
      });
    }
  })
  .catch( error => res.status(404).json({ error }));
}