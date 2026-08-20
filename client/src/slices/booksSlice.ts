import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../types/index.ts';

interface BooksState {
  items: Book[];
  loading: boolean;
}

const initialState: BooksState = {
  items: [],
  loading: false,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<Book[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addBook(state, action: PayloadAction<Book>) {
      state.items.push(action.payload);
    },
    updateBook(state, action: PayloadAction<Book>) {
      const index = state.items.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeBook(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b.id !== action.payload);
    },
  },
});

export const { setBooks, setLoading, addBook, updateBook, removeBook } =
  booksSlice.actions;
export default booksSlice.reducer;
