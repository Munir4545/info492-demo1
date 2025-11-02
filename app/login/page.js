'use client';

import { useState } from 'react';
import PasskeyLogin from '../components/PasskeyLogin';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const router = useRouter();

  const handleLoginSuccess = (data) => {
    setAuthData(data);
    setIsAuthenticated(true);
    
    // Redirect to home after 2 seconds
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="bg-green-500/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500/30 p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome Back!</h2>
            <p className="text-slate-300 mb-2">
              Authenticated as: <span className="font-semibold text-white">{authData?.user}</span>
            </p>
            <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return <PasskeyLogin onLoginSuccess={handleLoginSuccess} />;
}
