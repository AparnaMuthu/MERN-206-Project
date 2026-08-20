import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import {
  setBooks,
  setLoading,
  addBook as addBookToSlice,
  updateBook as updateBookInSlice,
  removeBook,
} from '../../slices/booksSlice.ts';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from '../../services/bookService.ts';
import type { Book } from '../../types/index.ts';

export default function InventoryTable() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.items);
  const loading = useAppSelector((state) => state.books.loading);

  // State for the add-book form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    coverImageUrl: '',
    totalCopies: 1,
    availableCopies: 1,
  });

  // Load books on mount
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

  // Define table columns
  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      { accessorKey: 'title', header: 'Title', size: 200 },
      { accessorKey: 'author', header: 'Author', size: 150 },
      { accessorKey: 'isbn', header: 'ISBN', size: 150 },
      { accessorKey: 'genre', header: 'Genre', size: 100 },
      {
        accessorKey: 'totalCopies',
        header: 'Total',
        size: 80,
      },
      {
        accessorKey: 'availableCopies',
        header: 'Available',
        size: 80,
      },
    ],
    []
  );

  // Handle add book
  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.genre) {
      alert('Please fill in Title, Author, ISBN, and Genre.');
      return;
    }
    try {
      const created = await addBook(newBook);
      dispatch(addBookToSlice(created));
      setShowAddForm(false);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        description: '',
        coverImageUrl: '',
        totalCopies: 1,
        availableCopies: 1,
      });
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  // Handle delete book
  const handleDeleteBook = async (row: MRT_Row<Book>) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${row.original.title}"?`
    );
    if (!confirmed) return;

    try {
      await deleteBook(row.original.id);
      dispatch(removeBook(row.original.id));
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  // Handle inline edit save
  const handleSaveEdit = async (bookId: string, updates: Partial<Book>) => {
    try {
      const updated = await updateBook(bookId, updates);
      dispatch(updateBookInSlice(updated));
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  return (
    <div>
      {/* Add Book button + form */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Book'}
        </button>
      </div>

      {/* Add Book form */}
      {showAddForm && (
        <div
          style={{
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <input
            placeholder="Title *"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          <input
            placeholder="Author *"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          <input
            placeholder="ISBN *"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          <select
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          >
            <option value="">Select Genre *</option>
            <option value="Fiction">Fiction</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Mystery">Mystery</option>
          </select>
          <input
            placeholder="Description"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          <input
            placeholder="Cover Image URL"
            value={newBook.coverImageUrl}
            onChange={(e) => setNewBook({ ...newBook, coverImageUrl: e.target.value })}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          <input
            type="number"
            placeholder="Total Copies"
            value={newBook.totalCopies}
            onChange={(e) =>
              setNewBook({ ...newBook, totalCopies: Number(e.target.value), availableCopies: Number(e.target.value) })
            }
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            min={1}
          />
          <button
            onClick={handleAddBook}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2e7d32',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Book
          </button>
        </div>
      )}

      {/* Data table */}
      <MaterialReactTable
        columns={columns}
        data={books}
        state={{ isLoading: loading }}
        enableEditing
        editDisplayMode="row"
        onEditingRowSave={({ row, values, table }) => {
          handleSaveEdit(row.original.id, {
            title: values.title,
            author: values.author,
            isbn: values.isbn,
            genre: values.genre,
            totalCopies: Number(values.totalCopies),
            availableCopies: Number(values.availableCopies),
          });
          table.setEditingRow(null);
        }}
        onEditingRowCancel={() => {}}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row, table }) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => table.setEditingRow(row)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteBook(row)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#d32f2f',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        )}
        muiTablePaperProps={{ sx: { boxShadow: 'none' } }}
      />
    </div>
  );
}
