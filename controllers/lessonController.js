const Lesson = require('../models/Lesson');
const User = require('../models/User');

exports.addLesson = async (req, res) => {
  const { subject, day, startTime, endTime } = req.body;
  if (!subject || !day || !startTime || !endTime)
    return res.status(400).json({ msg: 'يرجى ملء جميع الحقول' });
  const lesson = new Lesson({
    user: req.user.id,
    subject,
    day,
    startTime,
    endTime,
  });
  await lesson.save();
  res.status(201).json(lesson);
};

exports.getLessons = async (req, res) => {
  const lessons = await Lesson.find({ user: req.user.id });
  res.json(lessons);
};

exports.deleteLesson = async (req, res) => {
  await Lesson.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ msg: 'تم الحذف' });
};

exports.getFreeHours = async (req, res) => {
  const lessons = await Lesson.find({ user: req.user.id, day: req.params.day });
  const occupied = lessons.map((l) => [l.startTime, l.endTime]);
  let free = [];
  let start = '08:00';
  for (const [s, e] of occupied.sort()) {
    if (start < s) free.push([start, s]);
    if (e > start) start = e;
  }
  if (start < '22:00') free.push([start, '22:00']);
  res.json({ free });
};
