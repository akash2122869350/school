const express = require('express');
const path = require('path');
const authRoutes = require('./authController');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', authRoutes);

app.post('/api/attendance', (req, res) => {
  const { studentName, status, date } = req.body;
  if (!studentName || !status || !date) {
    return res.status(400).json({ msg: 'All fields required' });
  }
  console.log(`[ATTENDANCE] ${studentName} marked ${status} on ${date}`);
  res.json({ msg: `Marked ${studentName} as ${status}` });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
