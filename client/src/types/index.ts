export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  membershipId: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  coverImageUrl: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned';
}
