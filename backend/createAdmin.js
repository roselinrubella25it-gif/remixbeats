const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beatsby');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'x' });
    if (existingAdmin) {
      console.log('Admin user "x" already exists.');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create the admin user
    const admin = new Admin({
      username: 'x',
      password: hashedPassword,
      email: 'admin@beatsbydre.com'
    });

    await admin.save();
    console.log('Admin user "x" created successfully.');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();