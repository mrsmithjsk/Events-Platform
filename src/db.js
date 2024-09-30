const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const connectDB = async (uri) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
    console.log('DB connected');
  }
};

const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD.trim();

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Event Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('Admin email:', adminEmail);
      console.log('Attempting to create user:', { name: 'Event Admin', email: adminEmail, password: adminPassword });

      await adminUser.save();
      console.log('Admin user created:', adminUser);
    } else {
      console.log('Admin user already exists:', existingAdmin);
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};


const disconnectDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectDB, disconnectDB, createAdminUser };
