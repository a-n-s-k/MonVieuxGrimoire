require('dotenv').config({path: './.env'});
const bcryptCo = require('bcrypt');
const jwtCo = require('jsonwebtoken');
const User = require('../models/user-models');

// LOGIN: Connexion à son compte
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({ message: 'identifiant ou mot de passe incorrect' });
    }
    bcryptCo.compare(req.body.password, user.password)
    .then(valid => {
      if (!valid) {
      return res.status(401).json({ message: 'identifiant ou mot de passe incorrect' });
      }
      res.status(200).json({
        userId: user._id,
        token: jwtCo.sign(
          { userId: user._id },
          process.env.TOKEN_SECRET,
          { expiresIn: '24h' }
        )
      });
    })
    .catch(error => res.status(500).json({ error })
    );
  })
  .catch(error => res.status(500).json({ error }));
}

// SIGNUP: Création de compte
exports.signup = (req, res, next) => {
  bcryptCo.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
          password: hash
      });
      user
      .save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé!' }))
      .catch(error => {
      console.error(error);
        res.status(400).json({ error: "Une erreur est survenue lors de la création de l'utilisateur." })});
    })
    .catch(error => res.status(500).json({ error }));
}