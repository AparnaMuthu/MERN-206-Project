import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

/**
 * GET /api/users
 * Returns all users (without passwords). Admin-only in a real app.
 */
export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    // .select('-password') excludes the password field from results
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}
