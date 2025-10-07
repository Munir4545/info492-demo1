'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Shield } from 'lucide-react';

export default function LoginPage({ onLogin, onStartAttackSimulation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple authentication - any credentials work for demo
    if (username && password) {
      onLogin({
        username: username,
        role: 'Dispatcher',
        id: 'DISP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      });
    } else {
      setError('Please enter both username and password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            PNW Logistics Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Last-Mile Delivery Operations Portal
          </p>
        </div>

        {/* Simulation Access Card */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-200 dark:border-orange-800 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200">
              Security Research Demo
            </h3>
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
            Experience the AI-orchestrated attack simulation without logging in. 
            See how multi-vector attacks can compromise delivery networks.
          </p>
          <button
            onClick={onStartAttackSimulation}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <Play size={16} />
            Start Attack Simulation
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Dispatcher Login
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Access the full operations dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4">
              Demo credentials: Use any username/password combination
            </p>
            
            {/* Simulation Button */}
            <button
              onClick={onStartAttackSimulation}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Play size={20} />
              Start Attack Simulation
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tacoma to Eastern Washington Operations
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Security Demo - Research Project
          </p>
        </div>
      </div>
    </div>
  );
}

