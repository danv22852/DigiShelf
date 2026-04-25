import mongoose, { Schema, Document } from 'mongoose';

export interface IBook {
  _id?: mongoose.Types.ObjectId;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  isbn?: string;
  userRating?: number;
  userReview?: string;
  addedAt: Date;
}

export interface IBookshelf {
  _id?: mongoose.Types.ObjectId;
  category: string;
  color: string;
  books: IBook[];
}

export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  bookshelves: IBookshelf[];
  createdAt: Date;
}

const BookSchema = new Schema<IBook>({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  cover:       { type: String },
  description: { type: String },
  isbn:        { type: String },
  userRating:  { type: Number, min: 1, max: 5 },
  userReview:  { type: String },
  addedAt:     { type: Date, default: Date.now }
});

const BookshelfSchema = new Schema<IBookshelf>({
  category: { type: String, required: true },
  color:    { type: String, default: '#4A90D9' },
  books:    [BookSchema]
});

const UserSchema = new Schema<IUser>({
  email:             { type: String, required: true, unique: true, lowercase: true },
  password:          { type: String, required: true },
  isVerified:        { type: Boolean, default: false },
  verifyToken:       { type: String },
  verifyTokenExpiry: { type: Date },
  resetToken:        { type: String },
  resetTokenExpiry:  { type: Date },
  bookshelves:       [BookshelfSchema],
  createdAt:         { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);