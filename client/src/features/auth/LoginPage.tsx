import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks.ts';
import { setCurrentUser } from '../../slices/authSlice.ts';
import { loginUser } from '../../services/authService.ts';
import axios from 'axios';
import './LoginPage.css';

export default function LoginPage() {
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedId = membershipId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      setError('Please enter both Membership ID and Password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // All validation now happens on the backend
      const user = await loginUser(trimmedId, trimmedPassword);
      dispatch(setCurrentUser(user));
      navigate('/catalog');
    } catch (err) {
      // axios wraps API errors — extract the message from the response
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">📚</div>
          <h1>Library Inventory System</h1>
          <p>Sign in with your Membership ID and Password</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="membershipId">Membership ID</label>
            <input
              id="membershipId"
              type="text"
              placeholder="e.g. LIB-2024-001"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              className={error ? 'input-error' : ''}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? 'input-error' : ''}
            />
          </div>

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Hint section for testing */}
        <div className="login-hint">
          <p>Test Credentials:</p>
          <ul>
            <li><span className="hint-id">LIB-2024-001</span> / <span className="hint-pw">priya@123</span> — Priya Sharma (user)</li>
            <li><span className="hint-id">LIB-2024-002</span> / <span className="hint-pw">rahul@123</span> — Rahul Mehta (user)</li>
            <li><span className="hint-id">LIB-2024-003</span> / <span className="hint-pw">anita@123</span> — Anita Desai (admin)</li>
            <li><span className="hint-id">LIB-2024-004</span> / <span className="hint-pw">vikram@123</span> — Vikram Patel (user)</li>
            <li><span className="hint-id">LIB-2024-005</span> / <span className="hint-pw">sneha@123</span> — Sneha Iyer (admin)</li>
            <li><span className="hint-id">LIB-2024-006</span> / <span className="hint-pw">arjun@123</span> — Arjun Nair (user)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
