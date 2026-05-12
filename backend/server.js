// server.js
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';

config();
const app = express();
app.use(cors());
app.use(json());

// Import Routes
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'FreelanceChain API running' }));

// Connect to MongoDB
connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
