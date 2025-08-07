const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Archive = require("../models/Archive");
const auth = require("../middleware/auth");

// إضافة تاسك جديد
router.post("/", auth, async (req, res) => {
  const { title } = req.body;
  if (!title)
    return res.status(400).json({ msg: "يرجى كتابة عنوان التاسك" });
  const task = new Task({ user: req.user.id, title });
  await task.save();
  res.status(201).json(task);
});

// جلب كل التاسكات للمستخدم
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// حذف تاسك
router.delete("/:id", auth, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ msg: "تم الحذف" });
});

// تعليم تاسك كمكتمل
router.patch("/:id/done", auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { done: true },
    { new: true }
  );
  res.json(task);
});

// إحصائيات التاسكات (عدد المنجز وغير المنجز) من الأرشيف
router.get("/stats", auth, async (req, res) => {
  const tasks = await Archive.find({ user: req.user.id });
  const done = tasks.filter((t) => t.done).length;
  const notDone = tasks.length - done;
  res.json({ done, notDone });
});

// تعديل عنوان التاسك
router.patch("/:id", auth, async (req, res) => {
  const { title } = req.body;
  if (!title)
    return res.status(400).json({ msg: "يرجى كتابة عنوان جديد" });
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title },
    { new: true }
  );
  res.json(task);
});

// جلب التاسكات المنجزة فقط
router.get("/done", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id, done: true });
  res.json(tasks);
});

// جلب التاسكات غير المنجزة فقط
router.get("/undone", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id, done: false });
  res.json(tasks);
});

module.exports = router;
