import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import ProtectedRoute from '../components/ProtectedRoute.tsx';
import LoginPage from '../features/auth/LoginPage.tsx';
import CatalogPage from '../features/catalog/CatalogPage.tsx';
import BookDetailPage from '../features/catalog/BookDetailPage.tsx';
import MyBooksPage from '../features/mybooks/MyBooksPage.tsx';
import AdminPanel from '../features/admin/AdminPanel.tsx';

/**
 * AppRouter defines the entire route structure of the application.
 *
 * Route hierarchy:
 *   /login                → LoginPage (no layout, no navbar)
 *   /                     → Layout (navbar + outlet)
 *     /catalog            → CatalogPage (any logged-in user)
 *     /catalog/:bookId    → BookDetailPage (any logged-in user)
 *     /my-books           → MyBooksPage (any logged-in user)
 *     /admin              → AdminPanel (admin role only)
 *   *                     → Redirect to /catalog
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — no auth required */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes — wrapped in Layout (navbar + content) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default: redirect / to /catalog */}
          <Route index element={<Navigate to="/catalog" replace />} />

          {/* Book catalog */}
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:bookId" element={<BookDetailPage />} />

          {/* User's borrowed books */}
          <Route path="my-books" element={<MyBooksPage />} />

          {/* Admin-only routes */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all: redirect unknown routes */}
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
