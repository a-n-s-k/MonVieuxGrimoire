require('dotenv').config({path: './.env'});
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const  limiter  = require('./middlewares/express-rate-limit');

const app = express();

// Basic rate-limiting middleware for Express. 
// Use to limit repeated requests to public APIs and/or endpoints such as password reset.
app.use(limiter)


// To remove data by default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
app.use(mongoSanitize());

const userRoutes = require('./routes/userRtes');
const bookRoutes = require('./routes/bookRtes');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => console.log('La connexion à MongoDB réussie !'))
    .catch(() => console.log('La connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'cross-origin, X-Requested-With, Content, Accept, Content-Type, Authorization ');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;

