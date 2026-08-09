import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BorrowRecord } from '../types/index.ts';

interface BorrowsState {
  items: BorrowRecord[];
  loading: boolean;
}

const initialState: BorrowsState = {
  items: [],
  loading: false,
};

const borrowsSlice = createSlice({
  name: 'borrows',
  initialState,
  reducers: {
    setBorrows(state, action: PayloadAction<BorrowRecord[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addBorrow(state, action: PayloadAction<BorrowRecord>) {
      state.items.push(action.payload);
    },
    updateBorrow(state, action: PayloadAction<BorrowRecord>) {
      const index = state.items.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { setBorrows, setLoading, addBorrow, updateBorrow } =
  borrowsSlice.actions;
export default borrowsSlice.reducer;
