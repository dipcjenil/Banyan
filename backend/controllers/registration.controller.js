const Registration = require('../models/Registration.model');
const User = require('../models/User.model');
const { sendEmail } = require('../services/email.service');
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

/**
 * Generate ID Card and send email
 */
/**
 * Generate ID Card (Front and Back) and send email
 */
const generateAndSendCard = async (registration, userEmail) => {
    try {
        const width = 1000;
        const height = 600;
        
        // --- FRONT SIDE ---
        const frontCanvas = createCanvas(width, height);
        const frontCtx = frontCanvas.getContext('2d');

        // Background
        frontCtx.fillStyle = '#ffffff';
        frontCtx.fillRect(0, 0, width, height);

        // Border
        frontCtx.strokeStyle = '#040b2a';
        frontCtx.lineWidth = 10;
        frontCtx.strokeRect(20, 20, width - 40, height - 40);

        // Logo (Top Left)
        try {
            const logoPath = path.join(__dirname, '../assets/logo.png');
            const logo = await loadImage(logoPath);
            frontCtx.drawImage(logo, 80, 60, 150, 150);
        } catch (e) { console.error('Logo missing for front side'); }

        // Company Name (Top Middle/Right)
        frontCtx.fillStyle = '#040b2a';
        frontCtx.font = 'bold 60px Arial';
        frontCtx.fillText('BANYAN', 320, 120);
        frontCtx.font = '24px Arial';
        frontCtx.fillStyle = '#28a745';
        frontCtx.fillText('OFFICIAL MEMBER', 320, 160);

        // Member Photo (Bottom Left)
        frontCtx.fillStyle = '#f0f0f0';
        frontCtx.fillRect(80, 320, 200, 240);
        frontCtx.strokeStyle = '#28a745';
        frontCtx.lineWidth = 2;
        frontCtx.strokeRect(80, 320, 200, 240);
        frontCtx.fillStyle = '#888';
        frontCtx.font = '20px Arial';
        frontCtx.fillText('PHOTO', 140, 440);

        // Registration Number (Bottom Middle)
        frontCtx.fillStyle = '#040b2a';
        frontCtx.font = 'bold 30px Arial';
        frontCtx.fillText(`REG NO: ${registration.registrationNumber}`, 320, 460);

        // QR Code (Bottom Right)
        const qrCodeDataUrl = await QRCode.toDataURL(registration.registrationNumber);
        const qrImage = await loadImage(qrCodeDataUrl);
        frontCtx.drawImage(qrImage, 700, 320, 220, 220);

        // --- BACK SIDE ---
        const backCanvas = createCanvas(width, height);
        const backCtx = backCanvas.getContext('2d');

        // Background
        backCtx.fillStyle = '#ffffff';
        backCtx.fillRect(0, 0, width, height);

        // Border
        backCtx.strokeStyle = '#040b2a';
        backCtx.lineWidth = 10;
        backCtx.strokeRect(20, 20, width - 40, height - 40);

        // Logo (Top Left)
        try {
            const logoPath = path.join(__dirname, '../assets/logo.png');
            const logo = await loadImage(logoPath);
            backCtx.drawImage(logo, 80, 60, 100, 100);
        } catch (e) { console.error('Logo missing for back side'); }

        // Company Name (Top Middle)
        backCtx.fillStyle = '#040b2a';
        backCtx.font = 'bold 40px Arial';
        backCtx.fillText('BANYAN', 220, 120);

        // Address and Contact Details (Middle)
        backCtx.fillStyle = '#333';
        backCtx.font = 'bold 28px Arial';
        backCtx.fillText('MEMBER ADDRESS & CONTACT', 80, 280);
        
        backCtx.font = '22px Arial';
        backCtx.fillStyle = '#555';
        const addressLines = [
            `Address: ${registration.landInfo.address}`,
            `Land Location: ${registration.landInfo.location}`,
            `Contact: ${userEmail}`,
            `Issued By: Banyan Administrative Office`
        ];

        addressLines.forEach((line, index) => {
            backCtx.fillText(line, 80, 330 + (index * 40));
        });

        const frontBuffer = frontCanvas.toBuffer('image/png');
        const backBuffer = backCanvas.toBuffer('image/png');

        await sendEmail(
            userEmail,
            'Your Banyan Identification Card',
            `<h1>Congratulations ${registration.fullName}!</h1><p>Your registration is complete. Find your two-sided ID card attached.</p>`,
            [
                { filename: 'banyan-id-front.png', content: frontBuffer },
                { filename: 'banyan-id-back.png', content: backBuffer }
            ]
        );

        return true;
    } catch (error) {
        console.error('Card generation error:', error);
        return false;
    }
};

/**
 * POST /api/registration/submit
 */
const submitRegistration = async (req, res) => {
    try {
        const userId = req.user.id;
        const registrationData = req.body;

        const existingReg = await Registration.findOne({ user: userId });
        if (existingReg) {
            return res.status(400).json({ success: false, message: 'User already registered' });
        }

        const registrationNumber = `BN-${Math.floor(100000 + Math.random() * 900000)}`;

        const registration = new Registration({
            user: userId,
            ...registrationData,
            registrationNumber
        });

        await registration.save();

        // Update user status
        const user = await User.findByIdAndUpdate(userId, { isRegistered: true }, { new: true });

        // Generate and send card (Async - don't block response)
        generateAndSendCard(registration, user.email).catch(err => console.error('Delayed card send failed:', err));

        return res.status(201).json({
            success: true,
            message: 'Registration successful. Your ID card will be sent to your email.',
            registration
        });
    } catch (error) {
        console.error('Registration submit error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * GET /api/registration/my
 */
const getMyRegistration = async (req, res) => {
    try {
        const registration = await Registration.findOne({ user: req.user.id });
        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }
        return res.status(200).json({ success: true, registration });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { submitRegistration, getMyRegistration };
