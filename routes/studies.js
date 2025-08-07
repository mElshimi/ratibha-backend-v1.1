const express = require('express');
const Study = require('../models/Study');
const auth = require('../middleware/auth');

const router = express.Router();

// إضافة مذاكرة يومية
router.post('/', auth, async (req, res) => {
  const { subject, date, duration } = req.body;
  if (!subject || !date || !duration)
    return res.status(400).json({ msg: 'يرجى ملء جميع الحقول' });
  const study = new Study({ user: req.user.id, subject, date, duration });
  await study.save();
  res.status(201).json(study);
});

// جلب جدول المذاكرة اليومي
router.get('/:date', auth, async (req, res) => {
  const studies = await Study.find({ user: req.user.id, date: req.params.date });
  res.json(studies);
});

// حذف مذاكرة
router.delete('/:id', auth, async (req, res) => {
  await Study.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ msg: 'تم الحذف' });
});

// تعليم مذاكرة كمكتملة
router.patch('/:id/done', auth, async (req, res) => {
  const study = await Study.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { done: true }, { new: true });
  res.json(study);
});

module.exports = router;
