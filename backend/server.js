const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const User = require('./models/userModel');
dotenv.config();
const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});
async function ensureDefaultAdmin() {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;
    if (!email || !password) return;

    let admin = await User.findOne({ email });
    if (!admin) {
      admin = await User.create({
        name: 'Default Admin',
        email,
        password,
        role: 'admin'
      });
      console.log('Default admin created:', email);
    } else {
      console.log('Default admin already exists:', email);
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
}
ensureDefaultAdmin();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
