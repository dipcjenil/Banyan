require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'email role isRegistered');
        console.log('--- SYSTEM USERS ---');
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

listUsers();
