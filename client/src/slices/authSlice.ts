import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/index.ts';

interface AuthState {
  currentUser: User | null;
}

// Try to restore session from localStorage on app load
function loadUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;
    const user = JSON.parse(stored);
    // Discard stale sessions from Phase 1 (mock IDs like "user-3" instead of MongoDB ObjectIds)
    if (user.id && user.id.startsWith('user-')) {
      localStorage.removeItem('currentUser');
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  currentUser: loadUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      // Persist to localStorage so refresh doesn't lose session
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    clearCurrentUser(state) {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export default authSlice.reducer;
