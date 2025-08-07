const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  done: { type: Boolean, default: false },
  archivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Archive', archiveSchema);