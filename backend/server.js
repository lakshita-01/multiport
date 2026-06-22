require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

const defaultOrigins = ['https://vajreshvari.netlify.app', 'http://localhost:3000', 'http://localhost:5173'];
const allowedOrigins = [
  ...(process.env.FRONTEND_URL || '').split(','),
  ...defaultOrigins,
]
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/property', require('./routes/property'));
app.use('/api/matrimonial', require('./routes/matrimonial'));
app.use('/api/ecommerce', require('./routes/ecommerce'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ message: 'Unified Portal API' }));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ error: 'Internal server error' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
