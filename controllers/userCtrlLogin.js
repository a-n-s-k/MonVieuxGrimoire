require('dotenv').config({path: './.env'});
const bcryptCo = require('bcrypt');
const jwtCo = require('jsonwebtoken');
const User = require('../models/User');


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
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};