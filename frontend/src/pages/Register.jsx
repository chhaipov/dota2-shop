import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    authApi
      .register(username, password, email)
      .then((data) => {
        setCredentials({
          username: data.user.username,
          password: data.password,
          avatar_url: data.avatar_url,
        });
        toast.success('Account created!');
      })
      .catch((e) => {
        const msg = e.response?.data?.detail || 'Registration failed.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  if (credentials) {
    return (
      <div className="page login-page">
        <div className="auth-card">
          <div className="register-success">
            <div className="register-hero-avatar">
              <img src={credentials.avatar_url} alt={credentials.username} />
            </div>
            <h1>Account Created!</h1>
            <p className="subtitle">Here are your login credentials</p>

            <div className="register-credentials">
              <div className="credential-row">
                <span className="credential-label">Username</span>
                <span className="credential-value">{credentials.username}</span>
              </div>
              <div className="credential-row">
                <span className="credential-label">Password</span>
                <span className="credential-value">{credentials.password}</span>
              </div>
            </div>

            <p className="register-save-notice">
              Please save these credentials before continuing. You will need them to log in.
            </p>

            <Link to="/login" className="btn btn-primary btn-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page login-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join the Dota 2 Item Shop</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <label htmlFor="email">Email (optional)</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
