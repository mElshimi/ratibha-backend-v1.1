const express = require("express");
const Lesson = require("../models/Lesson");
const auth = require("../middleware/auth");

const router = express.Router();

// Add lesson
router.post("/", auth, async (req, res) => {
  const { subject, day, startTime, endTime, location } = req.body;
  if (!subject || !day || !startTime || !endTime)
    return res.status(400).json({ msg: "يرجى ملء جميع الحقول" });
  const lesson = new Lesson({
    user: req.user.id,
    subject,
    day,
    startTime,
    endTime,
  });
  await lesson.save();
  res.status(201).json(lesson);
});


// Get all lessons for user (كل الدروس)
router.get("/", auth, async (req, res) => {
  const lessons = await Lesson.find({ user: req.user.id });
  res.json(lessons);
});

// Get lessons and free hours for a specific day
router.get("/:day", auth, async (req, res) => {
  const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const day = req.params.day;
  if (!weekDays.includes(day))
    return res.status(400).json({ msg: "اليوم غير صحيح" });
  const lessons = await Lesson.find({ user: req.user.id, day });
  // حساب الأوقات الفاضية
  const occupied = lessons.map((l) => [l.startTime, l.endTime]);
  let free = [];
  let start = "08:00";
  for (const [s, e] of occupied.sort()) {
    if (start < s) free.push([start, s]);
    if (e > start) start = e;
  }
  if (start < "22:00") free.push([start, "22:00"]);
  res.json({ lessons, free });
});

// Delete lesson
router.delete("/:id", auth, async (req, res) => {
  await Lesson.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ msg: "تم الحذف" });
});

// Get free hours for a day
router.get("/free/:day", auth, async (req, res) => {
  const lessons = await Lesson.find({ user: req.user.id, day: req.params.day });
  // Assume day from 08:00 to 22:00
  const occupied = lessons.map((l) => [l.startTime, l.endTime]);
  let free = [];
  let start = "08:00";
  for (const [s, e] of occupied.sort()) {
    if (start < s) free.push([start, s]);
    if (e > start) start = e;
  }
  if (start < "22:00") free.push([start, "22:00"]);
  res.json({ free });
});

module.exports = router;
