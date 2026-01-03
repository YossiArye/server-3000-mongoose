const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  users: [{ type: Number }] // Array of User IDs
});

module.exports = mongoose.model('Website', websiteSchema);
