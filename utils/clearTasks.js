const Task = require('../models/Task');
const Archive = require('../models/Archive');
const Study = require('../models/Study');
const StudyArchive = require('../models/StudyArchive');
const cron = require('node-cron');
const moment = require('moment-timezone');

// دالة لمسح وأرشفة التاسكات وجدول المذاكرة في نهاية اليوم
async function clearTodayData() {
  const today = new Date().toISOString().slice(0, 10);

  // أرشفة وحذف التاسكات
  const tasks = await Task.find({ date: today });
  if (tasks.length > 0) {
    await Archive.insertMany(tasks.map(t => ({
      user: t.user,
      title: t.title,
      date: t.date,
      done: t.done,
      archivedAt: moment().tz('Africa/Cairo').toDate()
    })));
    await Task.deleteMany({ date: today });
    console.log('تم أرشفة وحذف كل التاسكات الخاصة بنهاية اليوم:', today);
  }

  // أرشفة وحذف جدول المذاكرة
  const studies = await Study.find({ date: today });
  if (studies.length > 0) {
    await StudyArchive.insertMany(studies.map(s => ({
      user: s.user,
      subject: s.subject,
      date: s.date,
      duration: s.duration,
      archivedAt: moment().tz('Africa/Cairo').toDate()
    })));
    await Study.deleteMany({ date: today });
    console.log('تم أرشفة وحذف كل المذاكرات الخاصة بنهاية اليوم:', today);
  }
}

module.exports = clearTodayData;
// const clearTodayData = require('./utils/clearTasks');
// cron.schedule('0 0 * * *', async () => {
//   await clearTodayData();
// });