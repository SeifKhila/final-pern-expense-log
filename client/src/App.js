import { useState } from 'react';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [isLoggingOut, setIsLoggingOut] = useState(false);


function handleLogout() {
  const ok = window.confirm("Are you sure you want to log out?");
  if (!ok) return;

  setIsLoggingOut(true);

  // clear auth
  localStorage.removeItem("token");
  setToken(""); //  THIS triggers the UI to switch back to Login/Register
  setAuthView("login");

  // optional tiny delay (purely cosmetic)
  setTimeout(() => {
    setIsLoggingOut(false);
  }, 200);
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
      <DashboardPage onLogout={handleLogout} isLoggingOut={isLoggingOut} />
    </div>
  );
}

export default App;


