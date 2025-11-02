'use client';

import { useState } from 'react';
import PasskeyLogin from '../components/PasskeyLogin';
import { useRouter } from 'next/navigation';
import { Smartphone, Monitor, Server, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const router = useRouter();

  const handleLoginSuccess = (data) => {
    setAuthData(data);
    setIsAuthenticated(true);
    
    // Store tier in localStorage for dashboard access control
    if (typeof window !== 'undefined') {
      localStorage.setItem('userTier', data.tier.toString());
      localStorage.setItem('userData', JSON.stringify(data));
    }
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleTierSelection = (tier) => {
    setSelectedTier(tier);
  };

  const handleBackToSelection = () => {
    setSelectedTier(null);
  };

  // Show success screen
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="bg-green-500/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500/30 p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Successful!</h2>
            <p className="text-slate-300 mb-2">
              Tier {authData?.tier}: {authData?.tier === 2 ? 'Driver' : authData?.tier === 3 ? 'Dispatcher' : 'Admin'}
            </p>
            <p className="text-slate-300 mb-2">
              Authenticated as: <span className="font-semibold text-white">{authData?.user}</span>
            </p>
            <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show passkey login if tier is selected
  if (selectedTier) {
    return (
      <div>
        <PasskeyLogin onLoginSuccess={handleLoginSuccess} tier={selectedTier} />
        <div className="absolute top-4 left-4">
          <button
            onClick={handleBackToSelection}
            className="text-slate-400 hover:text-white text-sm flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm border border-slate-700/50"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Tier Selection
          </button>
        </div>
      </div>
    );
  }

  // Show tier selection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              PNW Logistics Login
            </h1>
            <p className="text-slate-400">Select your access tier to continue</p>
          </div>

          {/* Tier Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Tier 2 - Driver */}
            <button
              onClick={() => handleTierSelection(2)}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-blue-500/30 hover:border-blue-500/60 p-6 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 text-left group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Smartphone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Tier 2</div>
                  <h3 className="text-lg font-bold text-white">Driver Mobile App</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Low privilege access. View and edit your own route data and delivery confirmations.
              </p>
              <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            {/* Tier 3 - Dispatcher */}
            <button
              onClick={() => handleTierSelection(3)}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-purple-500/30 hover:border-purple-500/60 p-6 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 text-left group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Monitor className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Tier 3</div>
                  <h3 className="text-lg font-bold text-white">Dispatcher Dashboard</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Mid privilege access. View all routes, driver locations, and modify route assignments.
              </p>
              <div className="flex items-center text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
                Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            {/* Tier 4 - Admin */}
            <button
              onClick={() => handleTierSelection(4)}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-red-500/30 hover:border-red-500/60 p-6 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 text-left group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-red-500/20">
                  <Server className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">Tier 4</div>
                  <h3 className="text-lg font-bold text-white">Admin Backend</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Full administrative access. Access all data, system configurations, and database controls.
              </p>
              <div className="flex items-center text-red-400 text-sm font-medium group-hover:gap-2 transition-all">
                Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-start gap-3 text-xs text-slate-400">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-300 mb-1">Mock Authentication</p>
                <p>This demonstration uses mock passkey authentication. Each tier has different access privileges and can only view/edit data appropriate to their role.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
