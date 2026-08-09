import BorrowRecord from '../models/BorrowRecord.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Returns all borrow records, optionally filtered by userId.
 * Populates book title and user name for convenience.
 */
export async function getBorrowRecords(userId?: string) {
  const filter = userId ? { userId } : {};
  return BorrowRecord.find(filter)
    .populate('bookId', 'title author coverImageUrl')
    .populate('userId', 'name email membershipId')
    .sort({ borrowDate: -1 });
}

/**
 * Creates a new borrow record.
 *
 * Business logic:
 * 1. Verify user exists
 * 2. Verify book exists and has available copies
 * 3. Decrement availableCopies on the book
 * 4. Create the borrow record with dueDate = borrowDate + 7 days
 */
export async function borrowBook(bookId: string, userId: string) {
  // Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // Validate book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError('Book not found.', 404);
  }

  // Check availability
  if (book.availableCopies <= 0) {
    throw new AppError(`No copies available for "${book.title}".`, 400);
  }

  // Check if user already has this book borrowed (not returned)
  const existingBorrow = await BorrowRecord.findOne({
    bookId,
    userId,
    status: 'borrowed',
  });
  if (existingBorrow) {
    throw new AppError('You already have an active borrow for this book.', 400);
  }

  // Create borrow record
  const borrowDate = new Date();
  const dueDate = new Date(borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

  const record = await BorrowRecord.create({
    bookId,
    userId,
    borrowDate,
    dueDate,
    returnDate: null,
    status: 'borrowed',
  });

  // Decrement available copies
  book.availableCopies -= 1;
  await book.save();

  // Return the record with populated fields
  const populated = await record.populate([
    { path: 'bookId', select: 'title author coverImageUrl' },
    { path: 'userId', select: 'name email membershipId' },
  ]);

  return { record: populated, updatedBook: book };
}

/**
 * Returns a borrowed book.
 *
 * Business logic:
 * 1. Verify the borrow record exists and is currently 'borrowed'
 * 2. Mark as returned (set returnDate and status)
 * 3. Increment availableCopies on the book
 */
export async function returnBook(recordId: string) {
  const record = await BorrowRecord.findById(recordId);
  if (!record) {
    throw new AppError('Borrow record not found.', 404);
  }

  if (record.status === 'returned') {
    throw new AppError('This book has already been returned.', 400);
  }

  // Mark as returned
  record.returnDate = new Date();
  record.status = 'returned';
  await record.save();

  // Increment available copies
  const book = await Book.findById(record.bookId);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  // Return updated data
  const populated = await record.populate([
    { path: 'bookId', select: 'title author coverImageUrl' },
    { path: 'userId', select: 'name email membershipId' },
  ]);

  return { record: populated, updatedBook: book };
}
