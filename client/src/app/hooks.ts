import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store.ts';

/**
 * Typed dispatch hook — returns a dispatch function that knows
 * about our specific thunk and action types.
 */
export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}

/**
 * Typed selector hook — the callback receives fully-typed state.
 * Usage: const books = useAppSelector(state => state.books.items)
 */
export function useAppSelector<T>(selector: (state: RootState) => T): T {
  return useSelector(selector);
}
