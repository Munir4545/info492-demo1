import { AttackProvider } from './state/AttackProvider';
import HackerDashboard from './pages/HackerDashboard';

function App() {
  return (
    <AttackProvider>
      <HackerDashboard />
    </AttackProvider>
  );
}

export default App;

