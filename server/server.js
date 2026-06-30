// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

// Load environment variables from your .env file
dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows your server to understand JSON data
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/lessons', lessonRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);
// A simple test route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the HanMemo API (ES Modules enabled)!" });
});

app.use(errorHandler);

// Set the port and start the server
const PORT =5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});