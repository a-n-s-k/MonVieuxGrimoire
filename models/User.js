const mongoose = require('mongoose');
const mongUniqValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  //email: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true, uniqueCaseInsensitive: true },
  password: { type: String, required: true }
});

userSchema.plugin(mongUniqValidator);

module.exports = mongoose.model('User', userSchema);