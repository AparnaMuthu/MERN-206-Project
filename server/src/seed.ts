import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Book from './models/Book.js';
import BorrowRecord from './models/BorrowRecord.js';

// Import mock data from the client's mock folder
import mockUsers from '../../client/src/mock/mockUsers.json' with { type: 'json' };
import mockBooks from '../../client/src/mock/mockBooks.json' with { type: 'json' };
import mockBorrowRecords from '../../client/src/mock/mockBorrowRecords.json' with { type: 'json' };

/**
 * Seed script — populates the database with mock data.
 *
 * What it does:
 * 1. Connects to MongoDB Atlas
 * 2. Clears existing data in all 3 collections (fresh start)
 * 3. Inserts users and books, mapping old string IDs to new MongoDB ObjectIds
 * 4. Inserts borrow records with the correct ObjectId references
 * 5. Disconnects and exits
 *
 * Run with: npm run seed
 */
async function seed() {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await BorrowRecord.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // --- Insert Users ---
    // We need to map old IDs (e.g., "user-1") to new MongoDB ObjectIds
    const userIdMap = new Map<string, mongoose.Types.ObjectId>();

    const usersToInsert = mockUsers.map((user) => {
      const objectId = new mongoose.Types.ObjectId();
      userIdMap.set(user.id, objectId);
      return {
        _id: objectId,
        name: user.name,
        email: user.email,
        password: user.password,
        membershipId: user.membershipId,
        role: user.role,
        createdAt: new Date(user.createdAt),
      };
    });

    await User.insertMany(usersToInsert);
    console.log(`✅ Inserted ${usersToInsert.length} users`);

    // --- Insert Books ---
    const bookIdMap = new Map<string, mongoose.Types.ObjectId>();

    const booksToInsert = mockBooks.map((book) => {
      const objectId = new mongoose.Types.ObjectId();
      bookIdMap.set(book.id, objectId);
      return {
        _id: objectId,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: book.genre,
        description: book.description,
        coverImageUrl: book.coverImageUrl,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        createdAt: new Date(book.createdAt),
      };
    });

    await Book.insertMany(booksToInsert);
    console.log(`✅ Inserted ${booksToInsert.length} books`);

    // --- Insert Borrow Records ---
    // Map old string references (bookId, userId) to real ObjectIds
    const borrowsToInsert = mockBorrowRecords.map((record) => {
      const bookObjectId = bookIdMap.get(record.bookId);
      const userObjectId = userIdMap.get(record.userId);

      if (!bookObjectId || !userObjectId) {
        throw new Error(
          `Could not map IDs for borrow record: bookId=${record.bookId}, userId=${record.userId}`
        );
      }

      return {
        _id: new mongoose.Types.ObjectId(),
        bookId: bookObjectId,
        userId: userObjectId,
        borrowDate: new Date(record.borrowDate),
        dueDate: new Date(record.dueDate),
        returnDate: record.returnDate ? new Date(record.returnDate) : null,
        status: record.status,
      };
    });

    await BorrowRecord.insertMany(borrowsToInsert);
    console.log(`✅ Inserted ${borrowsToInsert.length} borrow records`);

    console.log('\n🎉 Database seeded successfully!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
