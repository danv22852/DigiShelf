import mongoose, { Schema, Document } from 'mongoose';

export interface IBook {
  _id?: mongoose.Types.ObjectId;
  googleBooksId?: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: string;
  genre?: string;
  userRating?: number;
  userReview?: string;
  addedAt: Date;
  isManualEntry: boolean;
}

export interface IShelf {
  _id?: mongoose.Types.ObjectId;
  category: string;
  color: string;
  books: IBook[];
}

export interface IBookcase {
  _id?: mongoose.Types.ObjectId;
  name: string;
  shelves: IShelf[];
}

export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  bookcases: IBookcase[];
  createdAt: Date;
}

const BookSchema = new Schema<IBook>({
  googleBooksId: { type: String },
  title:         { type: String, required: true },
  author:        { type: String, required: true },
  cover:         { type: String },
  description:   { type: String },
  isbn:          { type: String },
  pageCount:     { type: Number },
  publishedDate: { type: String },
  genre:         { type: String },
  userRating:    { type: Number, min: 1, max: 5 },
  userReview:    { type: String },
  addedAt:       { type: Date, default: Date.now },
  isManualEntry: { type: Boolean, default: false }
});

const ShelfSchema = new Schema<IShelf>({
  category: { type: String, required: true },
  color:    { type: String, default: '#4A90D9' },
  books:    [BookSchema]
});

const BookcaseSchema = new Schema<IBookcase>({
  name:    { type: String, required: true },
  shelves: [ShelfSchema]
});

const UserSchema = new Schema<IUser>({
  email:             { type: String, required: true, unique: true, lowercase: true },
  password:          { type: String, required: true },
  isVerified:        { type: Boolean, default: false },
  verifyToken:       { type: String },
  verifyTokenExpiry: { type: Date },
  resetToken:        { type: String },
  resetTokenExpiry:  { type: Date },
  bookcases:         [BookcaseSchema],
  createdAt:         { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);