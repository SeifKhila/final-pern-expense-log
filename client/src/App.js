import { useState } from 'react';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
    setAuthView('login');
  }

  // If NOT logged in, show Login or Register
  if (!token) {
    return (
      <div className="App">
        {authView === 'login' ? (
          <LoginPage
            onLoginSuccess={(newToken) => setToken(newToken)}
            onGoToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterPage onRegisterSuccess={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // If logged in, show Dashboard
  return (
    <div className="App">
      <DashboardPage onLogout={handleLogout} />
    </div>
  );
}

export default App;


