import api from './api.ts';
import type { Book } from '../types/index.ts';

// Maps backend document (_id) to frontend shape (id)
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
 * Returns all books.
 * GET /api/books
 */
export async function getBooks(): Promise<Book[]> {
  const response = await api.get('/books');
  return response.data.data.map(mapBook);
}

/**
 * Returns a single book by ID.
 * GET /api/books/:id
 */
export async function getBookById(bookId: string): Promise<Book> {
  const response = await api.get(`/books/${bookId}`);
  return mapBook(response.data.data);
}

/**
 * Adds a new book.
 * POST /api/books
 */
export async function addBook(
  bookData: Omit<Book, 'id' | 'createdAt'>
): Promise<Book> {
  const response = await api.post('/books', bookData);
  return mapBook(response.data.data);
}

/**
 * Updates an existing book.
 * PUT /api/books/:id
 */
export async function updateBook(
  bookId: string,
  updates: Partial<Omit<Book, 'id' | 'createdAt'>>
): Promise<Book> {
  const response = await api.put(`/books/${bookId}`, updates);
  return mapBook(response.data.data);
}

/**
 * Deletes a book.
 * DELETE /api/books/:id
 */
export async function deleteBook(bookId: string): Promise<void> {
  await api.delete(`/books/${bookId}`);
}
