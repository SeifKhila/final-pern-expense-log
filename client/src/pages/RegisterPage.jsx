import { useState } from 'react';
import { register } from '../api/auth';

function RegisterPage({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setIsLoading(true);
      await register(email, password);

      setSuccess('Registration successful! You can now log in.');
      setEmail('');
      setPassword('');

      // After a short success message, go back to Login
      onRegisterSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <h1 className="authTitle">Create account</h1>
        <p className="authSubtitle">Register to start tracking expenses.</p>

        {error && <p className="error">{error}</p>}
        {success && <p className="muted">{success}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="formRow">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="formRow">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="authActions">
          <p className="muted">
            Already have an account?{' '}
            <button className="authLink" type="button" onClick={onRegisterSuccess}>
              Go to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
