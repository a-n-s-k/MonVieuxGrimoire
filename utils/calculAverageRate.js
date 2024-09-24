const calculateAverageRating = (bookId) => {
    return Book.findById(bookId)
      .then(book => {
        if (!book) {
          throw new Error('Livre non trouvé.');
        }
        const ratingsCount = book.ratings.length;
        const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        const averageRating = ratingsCount > 0 ? totalRatings / ratingsCount : 0;
  
        book.averageRating = averageRating;
  
        return book.save();
      });
  };

module.exports = calculateAverageRating;