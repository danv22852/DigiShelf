import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';

connectDB();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({
  origin: ["http://localhost:5173", CLIENT_URL].filter(Boolean) as string[],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));