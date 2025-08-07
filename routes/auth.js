const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword)
    return res.status(400).json({ msg: 'يرجى ملء جميع الحقول' });
  if (password !== confirmPassword)
    return res.status(400).json({ msg: 'كلمة المرور غير متطابقة' });
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ msg: 'الإيميل مستخدم بالفعل' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash });
  await user.save();
  res.status(201).json({ msg: 'تم التسجيل بنجاح' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'يرجى ملء جميع الحقول' });
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ msg: 'بيانات الدخول غير صحيحة' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ msg: 'بيانات الدخول غير صحيحة' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = router;
