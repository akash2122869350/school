const express = require('express');
const router = express.Router();
const { users, findUserByPhone, addUser } = require('./users');
const { generateToken } = require('./utils');

// ✅ LOGIN
router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const user = findUserByPhone(phone);
  if (!user || user.password !== password) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token, user: { role: user.role, name: user.name } });
});

// ✅ Admin/Staff Create User
router.post('/create-user', (req, res) => {
  const { name, phone, password, role } = req.body;

  if (!name || !phone || !password || !role) {
    return res.status(400).json({ msg: 'All fields required' });
  }

  const exists = findUserByPhone(phone);
  if (exists) return res.status(409).json({ msg: 'User already exists' });

  addUser({ name, phone, password, role });
  console.log(`[NEW USER] ${role.toUpperCase()}: ${name} (${phone})`);
  res.json({ msg: `User ${name} (${role}) created successfully.` });
});

module.exports = router;
