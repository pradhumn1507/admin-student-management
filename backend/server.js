// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import axios from 'axios';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Keep the server awake
const SERVER_URL = "https://admin-student-management.onrender.com"; // Replace with your actual Render server URL
const INTERVAL = 2 * 60 * 1000; // 5 minutes in milliseconds

const keepServerAlive = async () => {
  try {
    const response = await axios.get(SERVER_URL);
    console.log(`🟢 Server is awake: ${response.status} - ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error(`🔴 Server request failed: ${error.message}`);
  }
};

// Call immediately and then at intervals
keepServerAlive();
setInterval(keepServerAlive, INTERVAL);
