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
  color?: string;
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
  shareToken?: string;       // ← unique token for sharing
  isShared?: boolean;         // ← whether shelf is publicly shared
}

export interface IBookcase {
  _id?: mongoose.Types.ObjectId;
  name: string;
  shelves: IShelf[];
  isPublic?: boolean;         // ← public/private toggle
}

export interface IUser extends Document {
  email: string;
  password: string;
  displayName?: string;      // ← profile
  bio?: string;              // ← profile
  profilePicture?: string;   // ← profile (URL)
  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  bookcases: IBookcase[];
  followers: mongoose.Types.ObjectId[];   // ← users following this user
  following: mongoose.Types.ObjectId[];   // ← users this user follows
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
  color:         { type: String },
  userRating:    { type: Number, min: 1, max: 5 },
  userReview:    { type: String },
  addedAt:       { type: Date, default: Date.now },
  isManualEntry: { type: Boolean, default: false }
});

const ShelfSchema = new Schema<IShelf>({
  category:   { type: String, required: true },
  color:      { type: String, default: '#4A90D9' },
  books:      [BookSchema],
  shareToken: { type: String, default: null },
  isShared:   { type: Boolean, default: false }
});

const BookcaseSchema = new Schema<IBookcase>({
  name:     { type: String, required: true },
  shelves:  [ShelfSchema],
  isPublic: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser>({
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true },
  displayName:    { type: String },
  bio:            { type: String },
  profilePicture: { type: String },
  isVerified:     { type: Boolean, default: false },
  verifyToken:    { type: String },
  verifyTokenExpiry: { type: Date },
  resetToken:     { type: String },
  resetTokenExpiry:  { type: Date },
  bookcases:      [BookcaseSchema],
  followers:      [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following:      [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt:      { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);