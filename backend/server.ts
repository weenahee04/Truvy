// =====================================================
// US PRIME - Express Server Entry Point
// =====================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import bannerRoutes from './routes/banner.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// MIDDLEWARE
// =====================================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Request logging
app.use(morgan('combined'));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROUTES
// =====================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Banner management routes
app.use('/admin/banners', bannerRoutes);

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [{ field: 'route', message: `${req.method} ${req.path} not found`, code: 'NOT_FOUND' }]
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      errors: [{ field: 'file', message: err.message, code: 'UPLOAD_ERROR' }]
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`🚀 US PRIME API Server running on port ${PORT}`);
  console.log(`📋 Banner API: http://localhost:${PORT}/admin/banners`);
});

export default app;
