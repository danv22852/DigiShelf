import mongoose from 'mongoose';
const { Schema } = mongoose;

const BookSchema = new Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  cover:       { type: String },               // image URL
  description: { type: String },
  isbn:        { type: String },
  userRating:  { type: Number, min: 1, max: 5 },
  userReview:  { type: String },
  addedAt:     { type: Date, default: Date.now }
});

const CategorySchema = new Schema({
  category: { type: String, required: true },  // shelf name
  color:    { type: String, default: '#4A90D9' },
  books:    [BookSchema]
});

const UserSchema = new Schema({
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true },    // store HASHED only
  bookshelves: [CategorySchema],
  createdAt:   { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);