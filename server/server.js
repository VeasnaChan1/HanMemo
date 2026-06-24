// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from your .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows your server to understand JSON data

// A simple test route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the HanMemo API (ES Modules enabled)!" });
});

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});