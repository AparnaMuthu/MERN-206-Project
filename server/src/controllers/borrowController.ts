import type { Request, Response, NextFunction } from 'express';
import * as borrowService from '../services/borrowService.js';

/**
 * GET /api/borrows
 * Query params: ?userId=xxx (optional — filters by user)
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.query.userId as string | undefined;
    const records = await borrowService.getBorrowRecords(userId);
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/borrows
 * Body: { bookId, userId }
 */
export async function borrow(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookId, userId } = req.body;

    if (!bookId || !userId) {
      res.status(400).json({
        success: false,
        message: 'bookId and userId are required.',
      });
      return;
    }

    const result = await borrowService.borrowBook(bookId, userId);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/borrows/:id/return
 */
export async function returnBook(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await borrowService.returnBook(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
