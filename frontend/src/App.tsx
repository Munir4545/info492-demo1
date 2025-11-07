import { useEffect, useState } from 'react';
import { AttackProvider } from './state/AttackProvider';
import HackerDashboard from './pages/HackerDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const isAuthed = Boolean(token);

  return (
    <AttackProvider>
      {isAuthed ? <HackerDashboard /> : <LoginPage />}
    </AttackProvider>
  );
}

export default App;

