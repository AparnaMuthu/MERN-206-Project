import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  coverImageUrl: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: ['Fiction', 'Sci-Fi', 'Biography', 'History', 'Mystery'],
    },
    description: {
      type: String,
      default: '',
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    totalCopies: {
      type: Number,
      required: true,
      min: [0, 'Total copies cannot be negative'],
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'Available copies cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
