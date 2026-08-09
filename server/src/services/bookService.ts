import Book from '../models/Book.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Returns all books.
 */
export async function getAllBooks() {
  return Book.find().sort({ createdAt: -1 });
}

/**
 * Returns a single book by ID.
 */
export async function getBookById(bookId: string) {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError(`Book not found with id: ${bookId}`, 404);
  }
  return book;
}

/**
 * Creates a new book. Sets availableCopies = totalCopies by default.
 */
export async function createBook(bookData: {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description?: string;
  coverImageUrl?: string;
  totalCopies: number;
}) {
  // Check for duplicate ISBN
  const existing = await Book.findOne({ isbn: bookData.isbn });
  if (existing) {
    throw new AppError(`A book with ISBN "${bookData.isbn}" already exists.`, 400);
  }

  const book = await Book.create({
    ...bookData,
    availableCopies: bookData.totalCopies, // New book = all copies available
  });

  return book;
}

/**
 * Updates an existing book's fields.
 */
export async function updateBook(
  bookId: string,
  updates: Partial<{
    title: string;
    author: string;
    isbn: string;
    genre: string;
    description: string;
    coverImageUrl: string;
    totalCopies: number;
    availableCopies: number;
  }>
) {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError(`Book not found with id: ${bookId}`, 404);
  }

  // If totalCopies is being reduced, ensure it doesn't go below currently borrowed count
  if (updates.totalCopies !== undefined) {
    const currentlyBorrowed = book.totalCopies - book.availableCopies;
    if (updates.totalCopies < currentlyBorrowed) {
      throw new AppError(
        `Cannot reduce total copies below ${currentlyBorrowed} (currently borrowed).`,
        400
      );
    }
  }

  Object.assign(book, updates);
  await book.save();
  return book;
}

/**
 * Deletes a book. Only allowed if no active borrows exist for it.
 */
export async function deleteBook(bookId: string) {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError(`Book not found with id: ${bookId}`, 404);
  }

  if (book.availableCopies < book.totalCopies) {
    throw new AppError(
      'Cannot delete a book that has active borrows. Return all copies first.',
      400
    );
  }

  await book.deleteOne();
}
