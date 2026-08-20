import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

/**
 * ProtectedRoute guards routes that require authentication or a specific role.
 *
 * How it works:
 * - If no user is logged in → redirects to /login
 * - If a requiredRole is specified and the user doesn't have it → redirects to /catalog
 * - Otherwise → renders the children (the actual page content)
 *
 * Usage in routes:
 *   <ProtectedRoute>
 *     <CatalogPage />
 *   </ProtectedRoute>
 *
 *   <ProtectedRoute requiredRole="admin">
 *     <AdminPanel />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Not logged in at all — send to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role — send to catalog (safe default)
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/catalog" replace />;
  }

  // All good — render the page
  return <>{children}</>;
}
