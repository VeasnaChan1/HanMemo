// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows your server to understand JSON data
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/lessons', lessonRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the HanMemo API (ES Modules enabled)!" });
});

// Set the port and start the server
const PORT =5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});