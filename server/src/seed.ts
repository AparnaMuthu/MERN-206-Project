import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Book from './models/Book.js';
import BorrowRecord from './models/BorrowRecord.js';

// Import seed data from the server's own seed-data folder
import seedUsers from './seed-data/users.json' with { type: 'json' };
import seedBooks from './seed-data/books.json' with { type: 'json' };
import seedBorrows from './seed-data/borrowRecords.json' with { type: 'json' };

/**
 * Seed script — populates the database with sample data.
 *
 * Run with: npm run seed
 *
 * What it does:
 * 1. Connects to MongoDB Atlas
 * 2. Clears existing data in all 3 collections
 * 3. Inserts users and books with new ObjectIds
 * 4. Inserts borrow records referencing those ObjectIds
 * 5. Disconnects and exits
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
    const userIds: mongoose.Types.ObjectId[] = [];

    const usersToInsert = seedUsers.map((user) => {
      const objectId = new mongoose.Types.ObjectId();
      userIds.push(objectId);
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
    const bookIds: mongoose.Types.ObjectId[] = [];

    const booksToInsert = seedBooks.map((book) => {
      const objectId = new mongoose.Types.ObjectId();
      bookIds.push(objectId);
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
    // Uses array indexes to reference the correct user/book ObjectIds
    const borrowsToInsert = seedBorrows.map((record) => {
      return {
        _id: new mongoose.Types.ObjectId(),
        bookId: bookIds[record.bookIndex],
        userId: userIds[record.userIndex],
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
