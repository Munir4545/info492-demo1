import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, 'webauthn');
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg text-text-primary p-6">
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-xl shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-text-primary">Secure Access</h1>
          <p className="text-sm text-text-secondary">Sign in with passkey to operate the simulation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Operator ID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand.primary/40"
              placeholder="e.g. analyst01"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Access code (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand.primary/40"
              placeholder="Only used for fallbacks"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded p-2">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-brand-primary text-white py-2 px-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating…' : 'Sign in with Passkey'}
            </button>
            <button
              type="button"
              onClick={async () => { setLoading(true); const r = await login('demo-user','demo'); setLoading(false); if(!r.success){setError(r.error||'Login failed');}}}
              className="rounded-md border border-surface-border bg-white text-text-primary py-2 px-4 hover:bg-surface-bg"
            >
              Demo mode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

