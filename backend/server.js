import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tiktokRoutes from './routes/tiktokRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (support both /api/tiktok/download and /api/tiktok-download)
app.use('/api/tiktok', tiktokRoutes);
app.use('/api', tiktokRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TikTok Downloader API is running with TikWM Engine' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/tiktok-download`);
});
