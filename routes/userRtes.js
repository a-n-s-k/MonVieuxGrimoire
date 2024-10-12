const express = require('express');
const router = express.Router();

const { signup, login } = require('./../controllers/userCtrl');

//  S'inscrire pour publier modifier ou supprimer des livres
router.post('/signup', signup);

//  Se connecter pour publier modifier ou supprimer des livres
router.post('/login', login);

module.exports = router;
