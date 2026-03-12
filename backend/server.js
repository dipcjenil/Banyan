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
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/registration', registrationRoutes);

app.get('/', (req, res) => res.send('Banyan API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
