require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndices() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const collection = mongoose.connection.collection('users');
        const indices = await collection.indexes();
        console.log('Current indices:', indices);
        
        if (indices.some(idx => idx.name === 'mobileNumber_1')) {
            await collection.dropIndex('mobileNumber_1');
            console.log('Dropped mobileNumber_1 index');
        } else {
            console.log('Index mobileNumber_1 not found');
        }
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

fixIndices();
