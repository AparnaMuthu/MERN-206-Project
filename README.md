# Library / Book Inventory System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing a library's book inventory, borrowing, and returns.

Built as a MERN course certification project.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Redux Toolkit, React Router v7 |
| UI | HTML + CSS (custom), Material React Table (admin tables) |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas, Mongoose ODM |
| Build Tool | Vite |
| HTTP Client | Axios |

---

## Features

### User Features
- Login with Membership ID and Password
- Browse book catalog with search (by title/author) and genre filter
- View book detail page with availability info
- Borrow a book (if copies available)
- View "My Borrowed Books" with borrow/due dates
- Return borrowed books
- Session persists across browser refresh (localStorage)

### Admin Features
- All user features, plus:
- Admin Panel with tabbed views:
  - **Book Inventory** — Add, edit, delete books (inline row editing)
  - **Borrow Records** — View all borrows across all users
  - **Users** — View all registered users
- Role-gated access (admin routes blocked for regular users)

### Technical Features
- Responsive navbar with hamburger menu on mobile
- Loading skeleton animations
- Toast notification system (success/error popups)
- Global error handling (frontend + backend)
- Service layer pattern (easy to swap API implementations)
- CORS configured for local development

---

## Project Structure

```
Uptor Project/
├── client/                     # React frontend
│   ├── src/
│   │   ├── app/                # Redux store + typed hooks
│   │   ├── components/         # Shared UI (Layout, Navbar, Toast, Skeleton)
│   │   ├── features/
│   │   │   ├── auth/           # Login page
│   │   │   ├── catalog/        # Book catalog + detail page
│   │   │   ├── mybooks/        # User's borrowed books
│   │   │   └── admin/          # Admin panel (tables)
│   │   ├── routes/             # React Router config
│   │   ├── services/           # API calls (axios)
│   │   ├── slices/             # Redux Toolkit slices
│   │   └── types/              # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # MongoDB connection
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Error handler
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Route definitions
│   │   ├── services/           # Business logic
│   │   ├── index.ts            # Express app entry point
│   │   └── seed.ts             # Database seeder
│   ├── .env                    # Environment variables (git-ignored)
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with membershipId + password |
| POST | `/api/auth/logout` | Logout (acknowledgement) |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get a single book |
| POST | `/api/books` | Create a new book (admin) |
| PUT | `/api/books/:id` | Update a book (admin) |
| DELETE | `/api/books/:id` | Delete a book (admin) |

### Borrows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/borrows` | Get all borrow records |
| GET | `/api/borrows?userId=xxx` | Get borrows for a specific user |
| POST | `/api/borrows` | Borrow a book |
| PUT | `/api/borrows/:id/return` | Return a borrowed book |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin) |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (free tier)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Uptor Project"
```

### 2. Setup the server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/library-db?retryWrites=true&w=majority
PORT=5000
```

Seed the database with sample data:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client

```bash
cd client
npm install
npm run dev
```

### 4. Open the app

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Test Credentials

| Membership ID | Password | Name | Role |
|---------------|----------|------|------|
| LIB-2024-001 | priya@123 | Priya Sharma | user |
| LIB-2024-002 | rahul@123 | Rahul Mehta | user |
| LIB-2024-003 | anita@123 | Anita Desai | admin |
| LIB-2024-004 | vikram@123 | Vikram Patel | user |
| LIB-2024-005 | sneha@123 | Sneha Iyer | admin |
| LIB-2024-006 | arjun@123 | Arjun Nair | user |

---

## Architecture Decisions

1. **Service layer pattern** — Frontend services abstract the API. Components call service functions, not axios directly. This made the Phase 1→4 transition (mock data → real API) require changes in only 3 files.

2. **Business logic lives on the server** — Borrow/return validation, availability checks, and data integrity rules are enforced in the Express service layer, not the frontend.

3. **Redux as a cache** — Components dispatch service responses into Redux slices. Redux stores what the API returned — it doesn't compute or validate.

4. **No overdue logic in frontend** — Due dates are stored as data. Overdue calculation will be server-side (Phase 3 service layer) if needed in the future.

5. **Consistent API response shape** — Every endpoint returns `{ success: true, data: ... }` or `{ success: false, message: "..." }`.

---

## Scripts

### Client (`/client`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Server (`/server`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot reload (tsx watch) |
| `npm run seed` | Seed database with sample data |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production server |

---

## Database Schema

### Users Collection
```
{ name, email, password, membershipId, role, createdAt, updatedAt }
```

### Books Collection
```
{ title, author, isbn, genre, description, coverImageUrl, totalCopies, availableCopies, createdAt, updatedAt }
```

### BorrowRecords Collection
```
{ bookId (ref: Book), userId (ref: User), borrowDate, dueDate, returnDate, status, createdAt, updatedAt }
```

---

## License

This project is for educational purposes as part of a MERN stack certification course.
