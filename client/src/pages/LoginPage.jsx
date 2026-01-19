import { useState } from 'react';
import { login } from '../api/auth';

function LoginPage({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);

      const data = await login(email, password);

      localStorage.setItem('token', data.token);
      onLoginSuccess?.(data.token);

      setPassword('');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <h1 className="authTitle">Expense Log</h1>
        <p className="authSubtitle">Please log in to continue.</p>

        {error && <p className="error">{error}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="formRow">
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="formRow">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="authActions">
          <p className="muted">
            Don’t have an account?{' '}
            <button
              type="button"
              className="authLink"
              onClick={onGoToRegister}
            >
              Go to Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


