const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  day: { type: String, required: true }, // e.g., 'Monday'
  startTime: { type: String, required: true }, // 'HH:mm'
  endTime: { type: String, required: true },   // 'HH:mm'
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
