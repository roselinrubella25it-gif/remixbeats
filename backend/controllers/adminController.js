const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt received:', { username, password, timestamp: new Date().toISOString() });

    // Check for demo credentials first
    if (username === 'x' && password === 'admin123') {
      console.log('Demo credentials matched successfully');
      const token = jwt.sign(
        { id: 'demo-admin', username: 'admin' },
        process.env.JWT_SECRET || 'beatsbydre_admin_secret_2024',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        admin: { id: 'demo-admin', username: 'admin', email: 'admin@beatsbydre.com' },
        message: 'Demo login successful'
      });
    }

    // Check for actual admin in database
    const admin = await Admin.findOne({ username, isActive: true });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, admin: { id: admin._id, username: admin.username, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin profile
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create admin (for initial setup)
const createAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,
      password: hashedPassword,
      email
    });

    const savedAdmin = await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  login,
  getProfile,
  createAdmin
};