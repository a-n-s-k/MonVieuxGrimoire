require('dotenv').config({path: './.env'});
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const authRtes = require('./routes/userRtes');
const bookRtes = require('./routes/bookRtes');

// mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_CLUSTER +'.mongodb.net/?retryWrites=true&w=majority&appName=' + process.env.DB_NAME,
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,  
    { useNewUrlParser: true, useUnifiedTopology: true })
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

app.use('/api/auth', authRtes);
app.use('/api/books', bookRtes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

