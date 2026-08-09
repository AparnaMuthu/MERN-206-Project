import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.tsx';
import './Layout.css';

/**
 * Layout is the app shell that wraps all authenticated pages.
 * - Renders the Navbar at the top
 * - Renders the current route's component via <Outlet />
 */
export default function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
