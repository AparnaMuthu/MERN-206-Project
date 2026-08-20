import type { Request, Response, NextFunction } from 'express';
import * as bookService from '../services/bookService.js';

/**
 * GET /api/books
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/books/:id
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/books
 * Body: { title, author, isbn, genre, description?, coverImageUrl?, totalCopies }
 */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/books/:id
 * Body: partial book fields to update
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/books/:id
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(200).json({ success: true, message: 'Book deleted.' });
  } catch (error) {
    next(error);
  }
}
