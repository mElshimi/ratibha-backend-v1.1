function normalizeSubject(subject) {
  subject = subject.trim();
  if (subject.includes("الرياضيات")) return "الرياضيات";
  if (subject.includes("اللغة العربية")) return "اللغة العربية";
  if (subject.includes("الفيزياء")) return "الفيزياء";
  if (subject.includes("الكيمياء")) return "الكيمياء";
  if (subject.includes("الأحياء")) return "الأحياء";
  if (subject.includes("الجغرافيا")) return "الجغرافيا";
  if (subject.includes("التاريخ")) return "التاريخ";
  if (subject.includes("علم النفس")) return "علم النفس والاجتماع";
  if (subject.includes("الفلسفة")) return "الفلسفة والمنطق";
  if (subject.includes("اللغة الأجنبية الأولى")) return "اللغة الأجنبية الأولى";
  if (subject.includes("اللغة الأجنبية الثانية")) return "اللغة الأجنبية الثانية";
  if (subject.includes("الجيولوجيا")) return "الجيولوجيا وعلوم البيئة";
  if (subject.includes("التربية الدينية")) return "التربية الدينية";
  if (subject.includes("التربية الوطنية")) return "التربية الوطنية";
  if (subject.includes("الاقتصاد")) return "الاقتصاد والإحصاء";
  // أضف باقي المواد حسب الحاجة
  return subject;
}

module.exports = normalizeSubject;