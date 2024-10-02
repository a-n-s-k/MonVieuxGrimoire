const bcryptCo = require('bcrypt');
const User = require('../models/User');

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
              res.status(400).json({ error: "Une erreur est survenue lors de la création de l'utilisateur." });
            });
        })
        .catch(error => res.status(500).json({ error }));
}