import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { updateBook } from '../../slices/booksSlice.ts';
import { addBorrow } from '../../slices/borrowsSlice.ts';
import { getBookById } from '../../services/bookService.ts';
import { borrowBook } from '../../services/borrowService.ts';
import { BookDetailSkeleton } from '../../components/Skeleton.tsx';
import { useToast } from '../../components/Toast.tsx';
import type { Book } from '../../types/index.ts';
import './BookDetailPage.css';

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { showToast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  // Load the book data on mount
  useEffect(() => {
    async function loadBook() {
      if (!bookId) return;
      setLoading(true);
      try {
        const data = await getBookById(bookId);
        setBook(data);
      } catch (error) {
        console.error('Failed to load book:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [bookId]);

  const handleBorrow = async () => {
    if (!book || !currentUser) return;

    setBorrowing(true);

    try {
      const { record, updatedBook } = await borrowBook(book.id, currentUser.id);
      dispatch(updateBook(updatedBook));
      dispatch(addBorrow(record));
      setBook(updatedBook);
      showToast('Book borrowed successfully! Due in 7 days.', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to borrow book.',
        'error'
      );
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <button className="book-detail-back" onClick={() => navigate('/catalog')}>
          ← Back to Catalog
        </button>
        <BookDetailSkeleton />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="catalog-empty">
        <h3>Book not found</h3>
        <p>The book you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="book-detail-container">
      {/* Back button */}
      <button className="book-detail-back" onClick={() => navigate('/catalog')}>
        ← Back to Catalog
      </button>

      <div className="book-detail-content">
        {/* Book cover */}
        <img
          className="book-detail-image"
          src={book.coverImageUrl}
          alt={`Cover of ${book.title}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/250x350?text=No+Cover';
          }}
        />

        {/* Book info */}
        <div className="book-detail-info">
          <span className="book-detail-genre">{book.genre}</span>
          <h1 className="book-detail-title">{book.title}</h1>
          <p className="book-detail-author">by {book.author}</p>
          <p className="book-detail-description">{book.description}</p>

          {/* Metadata grid */}
          <div className="book-detail-meta">
            <div className="meta-item">
              <span className="meta-label">ISBN</span>
              <span className="meta-value">{book.isbn}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Genre</span>
              <span className="meta-value">{book.genre}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Total Copies</span>
              <span className="meta-value">{book.totalCopies}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Available Copies</span>
              <span className="meta-value">{book.availableCopies}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="book-detail-actions">
            <button
              className="borrow-button"
              onClick={handleBorrow}
              disabled={!isAvailable || borrowing}
            >
              {borrowing ? 'Borrowing...' : isAvailable ? 'Borrow This Book' : 'Not Available'}
            </button>
            <span className={`availability-status ${isAvailable ? 'available' : 'unavailable'}`}>
              {isAvailable
                ? `${book.availableCopies} of ${book.totalCopies} available`
                : 'All copies checked out'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
