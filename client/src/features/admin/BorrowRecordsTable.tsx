import { useEffect, useMemo } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { setBorrows, setLoading } from '../../slices/borrowsSlice.ts';
import { getBorrowRecords } from '../../services/borrowService.ts';
import type { BorrowRecord } from '../../types/index.ts';

export default function BorrowRecordsTable() {
  const dispatch = useAppDispatch();
  const borrows = useAppSelector((state) => state.borrows.items);
  const books = useAppSelector((state) => state.books.items);
  const loading = useAppSelector((state) => state.borrows.loading);

  // Load all borrow records on mount
  useEffect(() => {
    async function loadBorrows() {
      dispatch(setLoading(true));
      try {
        const data = await getBorrowRecords();
        dispatch(setBorrows(data));
      } catch (error) {
        console.error('Failed to load borrow records:', error);
      } finally {
        dispatch(setLoading(false));
      }
    }
    loadBorrows();
  }, [dispatch]);

  // Helper to find book title by ID
  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book?.title || bookId;
  };

  // Format date for display
  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return '—';
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const columns = useMemo<MRT_ColumnDef<BorrowRecord>[]>(
    () => [
      { accessorKey: 'id', header: 'Record ID', size: 120 },
      {
        accessorKey: 'bookId',
        header: 'Book',
        size: 200,
        Cell: ({ cell }) => getBookTitle(cell.getValue<string>()),
      },
      { accessorKey: 'userId', header: 'User ID', size: 100 },
      {
        accessorKey: 'borrowDate',
        header: 'Borrowed',
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'returnDate',
        header: 'Returned',
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string | null>()),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          return (
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: status === 'borrowed' ? '#fff3e0' : '#e8f5e9',
                color: status === 'borrowed' ? '#e65100' : '#2e7d32',
              }}
            >
              {status}
            </span>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [books]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={borrows}
      state={{ isLoading: loading }}
      enableEditing={false}
      muiTablePaperProps={{ sx: { boxShadow: 'none' } }}
    />
  );
}
