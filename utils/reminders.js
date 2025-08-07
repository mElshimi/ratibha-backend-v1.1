
const cron = require('node-cron');
const Lesson = require('../models/Lesson');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendEmail } = require('./notifications');
const mongoose = require('mongoose');

// تذكير قبل الدروس بنصف ساعة
cron.schedule('*/10 * * * *', async () => {
  // كل 10 دقائق: تحقق من الدروس القادمة خلال 30 دقيقة
  const now = new Date();
  const after30 = new Date(now.getTime() + 30 * 60000);
  const day = now.toLocaleString('en-US', { weekday: 'long' });
  const lessons = await Lesson.find({ day });
  for (const lesson of lessons) {
    const [h, m] = lesson.startTime.split(':');
    const lessonDate = new Date(now);
    lessonDate.setHours(Number(h), Number(m), 0, 0);
    if (lessonDate > now && lessonDate <= after30) {
      const user = await User.findById(lesson.user);
      if (user) {
        await sendEmail(user.email, 'تذكير بموعد الدرس', `لديك درس ${lesson.subject} الساعة ${lesson.startTime}`);
      }
    }
  }
});

// تذكير بالمهام غير المنجزة قبل نهاية اليوم بساعة
cron.schedule('0 23 * * *', async () => {
  // الساعة 11 مساءً كل يوم
  const today = new Date().toISOString().slice(0, 10);
  const tasks = await Task.find({ date: today, done: false });
  for (const task of tasks) {
    const user = await User.findById(task.user);
    if (user) {
      await sendEmail(user.email, 'تذكير بالمهام', `لديك مهام لم تنتهِ بعد: ${task.title}`);
    }
  }
});
