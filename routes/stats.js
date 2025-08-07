const express = require('express');
const Task = require('../models/Task');
const Archive = require('../models/Archive');
const StudyArchive = require('../models/StudyArchive');
const auth = require('../middleware/auth');
const normalizeSubject = require('../utils/normalizeSubject');

const router = express.Router();

// Daily stats (من الأرشيف) مع تحقق من وجود بيانات
router.get('/daily/:date', auth, async (req, res) => {
  const date = req.params.date;

  // إحصائيات التاسكات من الأرشيف
  const tasks = await Archive.find({ user: req.user.id, date });
  // تحقق من وجود بيانات التاسكات
  if (tasks.length === 0) {
    return res.json({ msg: "لا توجد تاسكات لهذا اليوم.", studyStats: {}, tasks: { done: 0, notDone: 0 } });
  }
  const done = tasks.filter(t => t.done).length;
  const notDone = tasks.length - done;

  // إحصائيات المذاكرة من أرشيف المذاكرة
  const studies = await StudyArchive.find({ user: req.user.id, date });
  // تحقق من وجود بيانات المذاكرة
  const studyStats = {};
  if (studies.length === 0) {
    return res.json({ msg: "لا توجد مذاكرة لهذا اليوم.", studyStats, tasks: { done, notDone } });
  }
  studies.forEach(s => {
    const normalized = normalizeSubject(s.subject);
    if (!studyStats[normalized]) studyStats[normalized] = 0;
    studyStats[normalized] += s.duration;
  });

  res.json({
    studyStats,
    tasks: { done, notDone }
  });
});

// Weekly stats (من الأرشيف)
router.get('/weekly/:friday', auth, async (req, res) => {
  const start = new Date(req.params.friday);
  start.setDate(start.getDate() - 6); // من السبت
  const end = new Date(req.params.friday);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  // إحصائيات التاسكات من الأرشيف
  const tasks = await Archive.find({
    user: req.user.id,
    date: { $gte: startStr, $lte: endStr }
  });
  const done = tasks.filter(t => t.done).length;
  const notDone = tasks.length - done;

  // إحصائيات المذاكرة من أرشيف المذاكرة
  const studies = await StudyArchive.find({
    user: req.user.id,
    date: { $gte: startStr, $lte: endStr }
  });
  const studyStats = {};
  studies.forEach(s => {
    const normalized = normalizeSubject(s.subject);
    if (!studyStats[normalized]) studyStats[normalized] = 0;
    studyStats[normalized] += s.duration;
  });

  // استخراج أكثر وأقل مادة تمت مذاكرتها
  let mostStudied = null, leastStudied = null;
  let max = -Infinity, min = Infinity;
  for (const [subject, hours] of Object.entries(studyStats)) {
    if (hours > max) { max = hours; mostStudied = subject; }
    if (hours < min) { min = hours; leastStudied = subject; }
  }

  res.json({
    studyStats,
    mostStudied,
    leastStudied,
    tasks: { done, notDone }
  });
});

// إحصائيات المذاكرة العامة مع مجموع الساعات الكلي
router.get('/study-stats', auth, async (req, res) => {
  const studies = await StudyArchive.find({ user: req.user.id });
  const studyStats = {};
  studies.forEach(s => {
    const normalized = normalizeSubject(s.subject);
    if (!studyStats[normalized]) studyStats[normalized] = 0;
    studyStats[normalized] += s.duration;
  });
  const totalHours = Object.values(studyStats).reduce((a, b) => a + b, 0);
  res.json({ studyStats, totalHours });
});

// إحصائيات لفترة مخصصة (من الأرشيف)
router.get('/range', auth, async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ msg: "يرجى تحديد تاريخ البداية والنهاية بصيغة YYYY-MM-DD" });
  }

  // إحصائيات التاسكات من الأرشيف
  const tasks = await Archive.find({
    user: req.user.id,
    date: { $gte: from, $lte: to }
  });
  const done = tasks.filter(t => t.done).length;
  const notDone = tasks.length - done;

  // إحصائيات المذاكرة من أرشيف المذاكرة
  const studies = await StudyArchive.find({
    user: req.user.id,
    date: { $gte: from, $lte: to }
  });
  const studyStats = {};
  studies.forEach(s => {
    const normalized = normalizeSubject(s.subject);
    if (!studyStats[normalized]) studyStats[normalized] = 0;
    studyStats[normalized] += s.duration;
  });
  const totalHours = Object.values(studyStats).reduce((a, b) => a + b, 0);

  res.json({
    studyStats,
    totalHours,
    tasks: { done, notDone }
  });
});

module.exports = router;
