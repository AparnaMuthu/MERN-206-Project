import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBorrowRecord extends Document {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: 'borrowed' | 'returned';
}

const borrowRecordSchema = new Schema<IBorrowRecord>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book', // References the Book model — enables .populate()
      required: [true, 'Book ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: [true, 'User ID is required'],
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned'],
      default: 'borrowed',
    },
  },
  {
    timestamps: true,
  }
);

const BorrowRecord = mongoose.model<IBorrowRecord>('BorrowRecord', borrowRecordSchema);

export default BorrowRecord;
