import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/database';

// Import routes
import aiRoutes from './routes/ai';
import interviewRoutes from './routes/interviews';
import { requestLogger, errorHandler, notFoundHandler } from './middleware';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---
// Use cors() before other middleware and routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(requestLogger);


// --- API Routes ---
app.use('/api/ai', aiRoutes);
app.use('/api/interviews', interviewRoutes);

// --- Health Check ---
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});


// --- Error Handling ---
app.use(errorHandler);
app.use('*', notFoundHandler);


// --- Start Server ---
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Dynamic AI Interview Backend running on port ${PORT}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();