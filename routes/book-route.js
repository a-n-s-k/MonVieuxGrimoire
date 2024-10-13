const express = require('express');
const router = express.Router();

const { postOneBook, postOneBookRate, getAllBooks,
    getOneBook, getBestRatedBooks,updateOneBook,
    deleteOneBook } = require('../controllers/book-controls');

const auth = require('../utils/authentification');
const  multer  = require('../utils/multer-sharp');

// Afficher tous les livres
router.get('/', getAllBooks);

// Afficher les livres les mieux notés
router.get('/bestrating', getBestRatedBooks);

// Afficher un seul livre
router.get('/:id', getOneBook);

// Poster un nouveau livre
router.post('/', auth, multer, postOneBook);

// Noter un livre
router.post('/:id/rating', auth, postOneBookRate)

// Modifier un livre
router.put('/:id', auth, multer, updateOneBook);

// Supprimer un livre
router.delete('/:id', auth, deleteOneBook);

module.exports = router;
