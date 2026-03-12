require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const registrationRoutes = require('./routes/registration.routes');

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/registration', registrationRoutes);

app.get('/', (req, res) => res.send('Banyan API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
