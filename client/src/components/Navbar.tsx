import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { clearCurrentUser } from '../slices/authSlice.ts';
import { logoutUser } from '../services/authService.ts';
import './Navbar.css';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(clearCurrentUser());
    navigate('/login');
  };

  if (!currentUser) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span>📚</span>
        LibraryMS
      </div>

      {/* Hamburger button (visible only on mobile via CSS) */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Navigation links — on mobile, shown/hidden via .open class */}
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <button
          className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}
          onClick={() => handleNavClick('/catalog')}
        >
          Catalog
        </button>
        <button
          className={`nav-link ${isActive('/my-books') ? 'active' : ''}`}
          onClick={() => handleNavClick('/my-books')}
        >
          My Books
        </button>
        {currentUser.role === 'admin' && (
          <button
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => handleNavClick('/admin')}
          >
            Admin Panel
          </button>
        )}

        {/* Mobile-only: user info + logout inside the dropdown */}
        <div className="mobile-user-info">
          <div className="user-badge">
            {currentUser.name}
            <span className="role-tag">{currentUser.role}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Desktop-only: user info + logout */}
      <div className="navbar-user">
        <div className="user-badge">
          {currentUser.name}
          <span className="role-tag">{currentUser.role}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
