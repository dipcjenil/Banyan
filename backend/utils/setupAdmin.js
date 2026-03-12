require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@banyan.com';
        const password = 'Admin@123';
        
        const existing = await User.findOne({ email });
        if (existing) {
            existing.role = 'admin';
            await existing.save();
            console.log('User promoted to admin');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new User({
                email,
                password: hashedPassword,
                role: 'admin',
                isRegistered: true
            });
            await admin.save();
            console.log('Admin account created: admin@banyan.com / Admin@123');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

createAdmin();
