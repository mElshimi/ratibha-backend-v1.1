const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');

// جلب كل المواد من قاعدة البيانات
router.get('/', auth, async (req, res) => {
  const subjects = await Subject.find({});
  res.json(subjects);
});

module.exports = router;