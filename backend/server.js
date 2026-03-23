const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/farms', require('./routes/farms'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/pests', require('./routes/pests'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/inputs', require('./routes/inputs'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/market', require('./routes/market'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/advisory', require('./routes/advisory'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AgriGuide AI Backend is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌱 AgriGuide AI Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
