const Book = require('../models/Book');


exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message
      });
    });
};

exports.getTargetBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => { res.json(books) })
    .catch(error => res.status(400).json({ error }));
};

exports.postNewBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  // const timestamp = Date.now();
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then(() => { res.status(201).json({ message: 'Succès !' }) })
    .catch(error => { res.status(400).json({ error }) })
};


exports.postTargetBookRate = (req, res, next) => {
  const bookId = req.params.id;
  const { rating, userId } = req.body;

  Book.findOneAndUpdate(
    { _id: bookId },
    { $push: { ratings: { userId, grade: rating } } },
    { new: true }
  )
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }

      const ratings = updatedBook.ratings.map((r) => r.grade);

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
};


exports.updateTargetBook = (req, res, next) => {
    if (req.file) {
      req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
  
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteTargetBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};
