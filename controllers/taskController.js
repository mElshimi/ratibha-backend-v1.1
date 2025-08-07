const Task = require('../models/Task');

exports.addTask = async (req, res) => {
  const { title, type, date } = req.body;
  if (!title || !type || !date)
    return res.status(400).json({ msg: 'يرجى ملء جميع الحقول' });
  const task = new Task({ user: req.user.id, title, type, date });
  await task.save();
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id, date: req.params.date });
  res.json(tasks);
};

exports.markDone = async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { done: true }, { new: true });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ msg: 'تم الحذف' });
};
