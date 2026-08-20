import api from './api.ts';
import type { BorrowRecord, Book } from '../types/index.ts';

// Maps backend borrow record to frontend shape
function mapBorrowRecord(doc: Record<string, unknown>): BorrowRecord {
  // Backend populates bookId/userId — they might be objects or strings
  const bookId = typeof doc.bookId === 'object' && doc.bookId !== null
    ? (doc.bookId as Record<string, unknown>)._id as string
    : doc.bookId as string;

  const userId = typeof doc.userId === 'object' && doc.userId !== null
    ? (doc.userId as Record<string, unknown>)._id as string
    : doc.userId as string;

  return {
    id: doc._id as string,
    bookId,
    userId,
    borrowDate: doc.borrowDate as string,
    dueDate: doc.dueDate as string,
    returnDate: doc.returnDate as string | null,
    status: doc.status as 'borrowed' | 'returned',
  };
}

// Maps backend book document to frontend shape
function mapBook(doc: Record<string, unknown>): Book {
  return {
    id: doc._id as string,
    title: doc.title as string,
    author: doc.author as string,
    isbn: doc.isbn as string,
    genre: doc.genre as string,
    description: doc.description as string,
    coverImageUrl: doc.coverImageUrl as string,
    totalCopies: doc.totalCopies as number,
    availableCopies: doc.availableCopies as number,
    createdAt: doc.createdAt as string,
  };
}

/**
 * Creates a new borrow record.
 * POST /api/borrows
 */
export async function borrowBook(
  bookId: string,
  userId: string
): Promise<{ record: BorrowRecord; updatedBook: Book }> {
  const response = await api.post('/borrows', { bookId, userId });
  const { record, updatedBook } = response.data.data;
  return {
    record: mapBorrowRecord(record),
    updatedBook: mapBook(updatedBook),
  };
}

/**
 * Returns a borrowed book.
 * PUT /api/borrows/:id/return
 */
export async function returnBook(
  recordId: string
): Promise<{ record: BorrowRecord; updatedBook: Book }> {
  const response = await api.put(`/borrows/${recordId}/return`);
  const { record, updatedBook } = response.data.data;
  return {
    record: mapBorrowRecord(record),
    updatedBook: mapBook(updatedBook),
  };
}

/**
 * Returns all borrow records (admin use).
 * GET /api/borrows
 */
export async function getBorrowRecords(): Promise<BorrowRecord[]> {
  const response = await api.get('/borrows');
  return response.data.data.map(mapBorrowRecord);
}

/**
 * Returns borrow records for a specific user.
 * GET /api/borrows?userId=xxx
 */
export async function getUserBorrowRecords(userId: string): Promise<BorrowRecord[]> {
  const response = await api.get(`/borrows?userId=${userId}`);
  return response.data.data.map(mapBorrowRecord);
}
