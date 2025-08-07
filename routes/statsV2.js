const express = require('express');
const Study = require('../models/Study');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// إحصائيات أسبوعية متقدمة
router.get('/weekly/:friday', auth, async (req, res) => {
  const start = new Date(req.params.friday);
  start.setDate(start.getDate() - 6); // من السبت
  const end = new Date(req.params.friday);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  // مذاكرة: تجميع الساعات لكل مادة
  const studies = await Study.find({
    user: req.user.id,
    date: { $gte: startStr, $lte: endStr }
  });
  const studyStats = {};
  studies.forEach(s => {
    if (!studyStats[s.subject]) studyStats[s.subject] = 0;
    studyStats[s.subject] += s.duration;
  });

  // تاسكات: المنجزة وغير المنجزة
  const tasks = await Task.find({
    user: req.user.id,
    date: { $gte: startStr, $lte: endStr }
  });
  const done = tasks.filter(t => t.done).length;
  const notDone = tasks.length - done;

  // استخراج أكثر وأقل مادة تمت مذاكرتها
  let mostStudied = null, leastStudied = null;
  let max = -Infinity, min = Infinity;
  for (const [subject, hours] of Object.entries(studyStats)) {
    if (hours > max) { max = hours; mostStudied = subject; }
    if (hours < min) { min = hours; leastStudied = subject; }
  }

  res.json({
    studyStats, // { مادة: مجموع الساعات }
    mostStudied,
    leastStudied,
    tasks: { done, notDone }
  });
});

module.exports = router;
