import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import bookcaseRoutes from './routes/bookcase';
import shelfRoutes from './routes/shelf';
import customizationRoutes from './routes/customization';
import searchRoutes from './routes/search';

connectDB();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({
  origin: ["http://localhost:5173", "https://digishelf.xyz"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth',                         authRoutes);
app.use('/api/bookcase',                     bookcaseRoutes);
app.use('/api/bookcase/:bookcaseId/shelves', shelfRoutes);
app.use('/api/bookcase/:bookcaseId/shelves', customizationRoutes);
app.use('/api/bookcase/:bookcaseId/shelves', searchRoutes);

app.listen(Number(process.env.PORT) || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);