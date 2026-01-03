const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  credentials: [{ type: String }]
});

module.exports = mongoose.model('Role', roleSchema);
