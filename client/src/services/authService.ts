import api from './api.ts';
import type { User } from '../types/index.ts';

/**
 * Logs in a user by membershipId and password.
 * POST /api/auth/login
 */
export async function loginUser(membershipId: string, password: string): Promise<User> {
  const response = await api.post('/auth/login', { membershipId, password });
  const userData = response.data.data;
  return {
    id: userData._id,
    name: userData.name,
    email: userData.email,
    password: '',
    membershipId: userData.membershipId,
    role: userData.role,
    createdAt: userData.createdAt,
  };
}

/**
 * Logs out the current user.
 * POST /api/auth/logout
 */
export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}

/**
 * Returns all users (admin use).
 * GET /api/users
 */
export async function getUsers(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data.data.map((u: Record<string, unknown>) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    password: '',
    membershipId: u.membershipId,
    role: u.role,
    createdAt: u.createdAt,
  }));
}
