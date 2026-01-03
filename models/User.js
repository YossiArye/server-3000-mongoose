const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar: { type: String },
  role: { type: Number, required: true } // keeping as Number reference to maintain compatibility
});

module.exports = mongoose.model('User', userSchema);
