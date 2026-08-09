import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { setBorrows, setLoading, updateBorrow } from '../../slices/borrowsSlice.ts';
import { updateBook } from '../../slices/booksSlice.ts';
import { getUserBorrowRecords, returnBook } from '../../services/borrowService.ts';
import { getBooks } from '../../services/bookService.ts';
import { setBooks } from '../../slices/booksSlice.ts';
import { MyBooksSkeleton } from '../../components/Skeleton.tsx';
import { useToast } from '../../components/Toast.tsx';
import type { BorrowRecord } from '../../types/index.ts';
import './MyBooksPage.css';

export default function MyBooksPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const books = useAppSelector((state) => state.books.items);
  const borrows = useAppSelector((state) => state.borrows.items);
  const loading = useAppSelector((state) => state.borrows.loading);
  const { showToast } = useToast();

  const [returningId, setReturningId] = useState<string | null>(null);

  // Load user's borrow records and books on mount
  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      dispatch(setLoading(true));
      try {
        const [borrowData, bookData] = await Promise.all([
          getUserBorrowRecords(currentUser.id),
          getBooks(),
        ]);
        dispatch(setBorrows(borrowData));
        dispatch(setBooks(bookData));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        dispatch(setLoading(false));
      }
    }
    loadData();
  }, [dispatch, currentUser]);

  // Filter borrows for current user (in case Redux has records from admin loading all)
  const userBorrows = borrows.filter((r) => r.userId === currentUser?.id);

  // Sort: active borrows first, then returned
  const sortedBorrows = [...userBorrows].sort((a, b) => {
    if (a.status === 'borrowed' && b.status === 'returned') return -1;
    if (a.status === 'returned' && b.status === 'borrowed') return 1;
    return 0;
  });

  // Helper to find book title/author by ID
  const getBookInfo = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book || null;
  };

  // Format ISO date to readable string
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleReturn = async (record: BorrowRecord) => {
    setReturningId(record.id);

    try {
      const { record: updatedRecord, updatedBook } = await returnBook(record.id);
      dispatch(updateBorrow(updatedRecord));
      dispatch(updateBook(updatedBook));
      showToast(`"${getBookInfo(record.bookId)?.title}" returned successfully!`, 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to return book.',
        'error'
      );
    } finally {
      setReturningId(null);
    }
  };

  if (loading) {
    return (
      <div className="mybooks-container">
        <div className="mybooks-header">
          <h1>My Borrowed Books</h1>
          <p>Loading your books...</p>
        </div>
        <MyBooksSkeleton />
      </div>
    );
  }

  return (
    <div className="mybooks-container">
      {/* Page header */}
      <div className="mybooks-header">
        <h1>My Borrowed Books</h1>
        <p>
          {userBorrows.filter((r) => r.status === 'borrowed').length} active borrow(s)
        </p>
      </div>

      {/* Empty state */}
      {sortedBorrows.length === 0 ? (
        <div className="mybooks-empty">
          <h3>No borrow records</h3>
          <p>You haven't borrowed any books yet. Head to the catalog to find something to read!</p>
        </div>
      ) : (
        /* Borrow records list */
        <div className="mybooks-list">
          {sortedBorrows.map((record) => {
            const bookInfo = getBookInfo(record.bookId);
            return (
              <div
                key={record.id}
                className={`mybooks-card ${record.status === 'returned' ? 'returned' : ''}`}
              >
                {/* Book thumbnail */}
                <img
                  className="mybooks-card-image"
                  src={bookInfo?.coverImageUrl || ''}
                  alt={bookInfo?.title || 'Book cover'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/60x80?text=?';
                  }}
                />

                {/* Book info and dates */}
                <div className="mybooks-card-info">
                  <h3 className="mybooks-card-title">
                    {bookInfo?.title || 'Unknown Book'}
                  </h3>
                  <p className="mybooks-card-author">
                    {bookInfo?.author || 'Unknown Author'}
                  </p>
                  <div className="mybooks-card-dates">
                    <div className="date-item">
                      Borrowed: <span>{formatDate(record.borrowDate)}</span>
                    </div>
                    <div className="date-item">
                      Due: <span>{formatDate(record.dueDate)}</span>
                    </div>
                    {record.returnDate && (
                      <div className="date-item">
                        Returned: <span>{formatDate(record.returnDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status + Return button */}
                <div className="mybooks-card-status">
                  <span className={`status-badge ${record.status}`}>
                    {record.status}
                  </span>
                  {record.status === 'borrowed' && (
                    <button
                      className="return-button"
                      onClick={() => handleReturn(record)}
                      disabled={returningId === record.id}
                    >
                      {returningId === record.id ? 'Returning...' : 'Return'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
