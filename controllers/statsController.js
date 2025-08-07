const Task = require('../models/Task');

exports.dailyStats = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id, date: req.params.date });
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  res.json({ total, done });
};

exports.weeklyStats = async (req, res) => {
  const start = new Date(req.params.friday);
  start.setDate(start.getDate() - 6);
  const end = new Date(req.params.friday);
  const tasks = await Task.find({
    user: req.user.id,
    date: { $gte: start.toISOString().slice(0,10), $lte: end.toISOString().slice(0,10) }
  });
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  res.json({ total, done });
};
