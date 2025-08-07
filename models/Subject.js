const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Subject", subjectSchema);

// سكريبت لإضافة المواد الثابتة مرة واحدة في قاعدة البيانات
const allSubjects = [
  "اللغة العربية",
  "اللغة الأجنبية الأولى",
  "اللغة الأجنبية الثانية",
  "الفيزياء",
  "الكيمياء",
  "الأحياء",
  "الجيولوجيا وعلوم البيئة",
  "الرياضيات البحتة - التفاضل والتكامل",
  "الرياضيات البحتة - الجبر والهندسة الفراغية",
  "الرياضيات التطبيقية - الميكانيكا",
  "التاريخ",
  "الجغرافيا",
  "علم النفس والاجتماع",
  "الفلسفة والمنطق",
  "الرياضيات التطبيقية والإحصاء",
  "التربية الدينية",
  "التربية الوطنية",
  "الاقتصاد والإحصاء",
];

// لتشغيل السكريبت مرة واحدة فقط لإدخال المواد
async function seedSubjects() {
  for (const name of allSubjects) {
    await module.exports.findOneAndUpdate({ name }, { name }, { upsert: true });
  }
  console.log("تم إضافة المواد الثابتة في قاعدة البيانات");
}

// إذا أردت تشغيل السكريبت مباشرة من الملف
seedSubjects();
