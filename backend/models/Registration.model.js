const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
    name: String,
    age: Number,
    relation: { type: String, enum: ['Son', 'Daughter'] }
});

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Basic Info
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    photo: { type: String }, // Base64 string
    familyDetails: [familyMemberSchema],

    // Land Info
    landInfo: {
        area: String,
        landType: String,
        address: String,
        location: String
    },

    // Financial Info
    financialDetails: {
        loan: Number,
        balance: Number,
        annualIncome: Number,
        predictedIncome: Number
    },

    registrationNumber: {
        type: String,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
