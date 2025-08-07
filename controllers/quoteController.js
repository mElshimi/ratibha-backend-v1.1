const quotes = [
  'لا يوجد مستحيل مع الإصرار.',
  'كل يوم هو فرصة جديدة للنجاح.',
  'ثق بنفسك وواصل التقدم.',
  'النجاح يبدأ بخطوة.',
  'اجتهد اليوم لتفتخر بنفسك غدًا.'
];

exports.getQuote = (req, res) => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: random });
};
