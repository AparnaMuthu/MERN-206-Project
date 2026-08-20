import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { setBooks, setLoading } from '../../slices/booksSlice.ts';
import { getBooks } from '../../services/bookService.ts';
import BookCard from './BookCard.tsx';
import { CatalogSkeleton } from '../../components/Skeleton.tsx';
import './CatalogPage.css';

export default function CatalogPage() {
  // Local state for search and filter (only matters to this component)
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  // Read from Redux store
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.items);
  const loading = useAppSelector((state) => state.books.loading);

  // Load books on first render
  useEffect(() => {
    async function loadBooks() {
      dispatch(setLoading(true));
      try {
        const data = await getBooks();
        dispatch(setBooks(data));
      } catch (error) {
        console.error('Failed to load books:', error);
      } finally {
        dispatch(setLoading(false));
      }
    }
    loadBooks();
  }, [dispatch]);

  // Extract unique genres from the books for the filter dropdown
  const genres = [...new Set(books.map((book) => book.genre))].sort();

  // Filter books based on search and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchTerm === '' ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = genreFilter === '' || book.genre === genreFilter;

    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="catalog-container">
        <div className="catalog-header">
          <h1>Book Catalog</h1>
          <p>Loading books...</p>
        </div>
        <CatalogSkeleton />
      </div>
    );
  }

  return (
    <div className="catalog-container">
      {/* Page header */}
      <div className="catalog-header">
        <h1>Book Catalog</h1>
        <p>Browse our collection of {books.length} books</p>
      </div>

      {/* Search and filter controls */}
      <div className="catalog-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="genre-select"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Book grid or empty state */}
      {filteredBooks.length > 0 ? (
        <div className="catalog-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <h3>No books found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
