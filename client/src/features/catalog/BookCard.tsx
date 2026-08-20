import { useNavigate } from 'react-router-dom';
import type { Book } from '../../types/index.ts';
import './BookCard.css';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  const isAvailable = book.availableCopies > 0;

  return (
    <article
      className="book-card"
      onClick={() => navigate(`/catalog/${book.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/catalog/${book.id}`);
      }}
    >
      {/* Book cover image */}
      <img
        className="book-card-image"
        src={book.coverImageUrl}
        alt={`Cover of ${book.title}`}
        onError={(e) => {
          // Fallback if image fails to load
          (e.target as HTMLImageElement).src =
            'https://via.placeholder.com/260x200?text=No+Cover';
        }}
      />

      <div className="book-card-body">
        {/* Genre badge */}
        <span className="book-card-genre">{book.genre}</span>

        {/* Title and author */}
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author}</p>

        {/* Footer: availability info */}
        <div className="book-card-footer">
          <span
            className={`book-card-availability ${isAvailable ? 'available' : 'unavailable'}`}
          >
            {isAvailable ? 'Available' : 'Not Available'}
          </span>
          <span className="book-card-copies">
            {book.availableCopies} / {book.totalCopies} copies
          </span>
        </div>
      </div>
    </article>
  );
}
