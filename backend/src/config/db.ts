import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB Atlas connected');
};