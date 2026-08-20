import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.ts';
import booksReducer from '../slices/booksSlice.ts';
import borrowsReducer from '../slices/borrowsSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    borrows: borrowsReducer,
  },
});

// These types are inferred from the store itself — used for typing hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
