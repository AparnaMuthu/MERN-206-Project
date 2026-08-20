import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';

/**
 * POST /api/auth/login
 * Body: { membershipId, password }
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { membershipId, password } = req.body;

    if (!membershipId || !password) {
      res.status(400).json({
        success: false,
        message: 'Membership ID and password are required.',
      });
      return;
    }

    const user = await authService.loginUser(membershipId, password);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * In a real app, this would invalidate a session/token.
 * For now, just acknowledges the logout.
 */
export async function logout(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}
