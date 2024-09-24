const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  grade: { type: Number, required: true}
});


module.exports = mongoose.model('Rate', rateSchema);