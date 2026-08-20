import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Finds a user by membershipId and validates their password.
 * Returns the user document (without password) on success.
 */
export async function loginUser(membershipId: string, password: string) {
  // Find user by membershipId (case-insensitive)
  const user = await User.findOne({
    membershipId: { $regex: new RegExp(`^${membershipId}$`, 'i') },
  });

  if (!user) {
    throw new AppError('Invalid Membership ID. No user found.', 401);
  }

  // Simple password check (no hashing in Phase 1 mock data)
  // In production, you'd use bcrypt.compare() here
  if (user.password !== password) {
    throw new AppError('Incorrect password.', 401);
  }

  // Return user data without password
  const userObj = user.toObject();
  const { password: _pw, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
}
