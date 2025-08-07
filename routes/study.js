const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// إضافة مذاكرة يومية
router.post('/', auth, async (req, res) => {
  const { title, date } = req.body;
  if (!title || !date)
    return res.status(400).json({ msg: 'يرجى ملء جميع الحقول' });
  const study = new Task({ user: req.user.id, title, type: 'study', date });
  await study.save();
  res.status(201).json(study);
});

// جلب جدول المذاكرة اليومي
router.get('/:date', auth, async (req, res) => {
  const study = await Task.find({ user: req.user.id, type: 'study', date: req.params.date });
  res.json(study);
});

// حذف مذاكرة
router.delete('/:id', auth, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user.id, type: 'study' });
  res.json({ msg: 'تم الحذف' });
});

// تعليم مذاكرة كمكتملة
router.patch('/:id/done', auth, async (req, res) => {
  const study = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id, type: 'study' }, { done: true }, { new: true });
  res.json(study);
});

module.exports = router;
