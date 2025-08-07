const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  duration: { type: Number, required: true }, // عدد الساعات
  done: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Study', studySchema);
