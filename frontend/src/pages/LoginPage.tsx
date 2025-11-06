import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import MatrixRain from '../components/MatrixRain';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [targetNetwork, setTargetNetwork] = useState('USPS Spokane');
  const [attackDay, setAttackDay] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-matrix-green overflow-hidden">
      <MatrixRain />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* ASCII Art Logo */}
          <div className="text-center mb-8 font-mono">
            <pre className="text-matrix-green text-sm leading-tight">
              {`
╔═══════════════════════════════╗
║   PHARMA ATTACK DEMO SYSTEM   ║
║      CYBER OPERATIONS         ║
╚═══════════════════════════════╝
              `}
            </pre>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-black border-2 border-matrix-green p-8 shadow-[0_0_20px_rgba(0,255,0,0.3)]"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-matrix-green mb-2 font-mono text-sm">
                  OPERATOR ID
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-matrix-green text-matrix-green px-4 py-2 font-mono focus:outline-none focus:border-matrix-green focus:ring-2 focus:ring-matrix-green focus:ring-opacity-50"
                  placeholder="Enter operator ID"
                  required
                />
              </div>

              <div>
                <label className="block text-matrix-green mb-2 font-mono text-sm">
                  ACCESS CODE
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-matrix-green text-matrix-green px-4 py-2 font-mono focus:outline-none focus:border-matrix-green focus:ring-2 focus:ring-matrix-green focus:ring-opacity-50"
                  placeholder="Enter access code"
                  required
                />
              </div>

              <div>
                <label className="block text-matrix-green mb-2 font-mono text-sm">
                  TARGET NETWORK
                </label>
                <select
                  value={targetNetwork}
                  onChange={(e) => setTargetNetwork(e.target.value)}
                  className="w-full bg-black border border-matrix-green text-matrix-green px-4 py-2 font-mono focus:outline-none focus:border-matrix-green focus:ring-2 focus:ring-matrix-green focus:ring-opacity-50"
                >
                  <option value="USPS Spokane">USPS Spokane</option>
                  <option value="USPS Pullman">USPS Pullman</option>
                  <option value="USPS Spokane-Pullman">USPS Spokane-Pullman</option>
                </select>
              </div>

              <div>
                <label className="block text-matrix-green mb-2 font-mono text-sm">
                  ATTACK DAY
                </label>
                <select
                  value={attackDay}
                  onChange={(e) => setAttackDay(e.target.value)}
                  className="w-full bg-black border border-matrix-green text-matrix-green px-4 py-2 font-mono focus:outline-none focus:border-matrix-green focus:ring-2 focus:ring-matrix-green focus:ring-opacity-50"
                >
                  <option value="1">Day 1 (30% success rate)</option>
                  <option value="2">Day 2 (45% success rate)</option>
                  <option value="3">Day 3 (60% success rate)</option>
                </select>
              </div>

              {error && (
                <div className="text-red-500 font-mono text-sm border border-red-500 p-2">
                  ERROR: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-matrix-green text-black font-mono py-3 px-6 font-bold hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-matrix-green"
              >
                {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
              </button>
            </div>

            <div className="mt-6 text-center text-matrix-green text-xs font-mono opacity-60">
              Demo Credentials: demo / demo123
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

