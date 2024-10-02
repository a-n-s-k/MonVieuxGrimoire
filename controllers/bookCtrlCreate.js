const Book = require('../models/Book');

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