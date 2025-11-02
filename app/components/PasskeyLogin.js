'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, Shield, CheckCircle2, Loader2, Smartphone, Monitor, Server, Users } from 'lucide-react';

// Tier configuration
const tierConfig = {
  2: {
    name: 'Driver Mobile App',
    title: 'PNW Logistics Driver',
    description: 'Sign in with Passkey',
    subDescription: 'Use your device\'s biometric authentication or security key to sign in securely.',
    icon: Smartphone,
    color: 'blue',
    userPrefix: 'driver',
    platform: 'in-app',
    redirectPath: '/tier-2/dashboard'
  },
  3: {
    name: 'Dispatcher Dashboard',
    title: 'PNW Logistics Dispatch',
    description: 'WebAuthn Passkey Authentication',
    subDescription: 'Use WebAuthn to sign in with your passkey to access the dispatcher dashboard.',
    icon: Monitor,
    color: 'purple',
    userPrefix: 'dispatcher',
    platform: 'webauthn',
    redirectPath: '/tier-3/dashboard'
  },
  4: {
    name: 'Admin Backend',
    title: 'PNW Logistics Admin',
    description: 'Single Sign-On (SSO) Passkey',
    subDescription: 'Sign in with SSO passkey to access administrative controls and other applications.',
    icon: Server,
    color: 'red',
    userPrefix: 'admin',
    platform: 'sso',
    redirectPath: '/tier-4/dashboard'
  }
};

export default function PasskeyLogin({ onLoginSuccess, tier = 2 }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState('ready'); // ready, checking, verifying, success
  const [error, setError] = useState(null);
  
  const config = tierConfig[tier] || tierConfig[2];
  const IconComponent = config.icon;
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/20',
      icon: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-500/30',
      text: 'text-blue-400'
    },
    purple: {
      bg: 'bg-purple-500/20',
      icon: 'text-purple-400',
      button: 'bg-purple-600 hover:bg-purple-700',
      border: 'border-purple-500/30',
      text: 'text-purple-400'
    },
    red: {
      bg: 'bg-red-500/20',
      icon: 'text-red-400',
      button: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-500/30',
      text: 'text-red-400'
    }
  };
  const colors = colorClasses[config.color];

  const handlePasskeyLogin = async () => {
    setIsAuthenticating(true);
    setError(null);
    setAuthStage('checking');

    // Simulate passkey discovery phase
    await new Promise(resolve => setTimeout(resolve, 800));
    setAuthStage('verifying');

    // Simulate passkey verification
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock: 90% success rate (simulating real passkey success rate)
    const success = Math.random() > 0.1;

    if (success) {
      setAuthStage('success');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call success callback after animation
      if (onLoginSuccess) {
        onLoginSuccess({
          tier,
          method: 'passkey',
          platform: config.platform,
          timestamp: new Date().toISOString(),
          user: `${config.userPrefix}@pnwlogistics.com`,
          redirectPath: config.redirectPath
        });
      }
    } else {
      setAuthStage('ready');
      setError('Passkey authentication failed. Please try again.');
      setIsAuthenticating(false);
    }
  };

  const handleCancel = () => {
    setIsAuthenticating(false);
    setAuthStage('ready');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.bg} mb-4`}>
              <IconComponent className={`w-8 h-8 ${colors.icon}`} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {config.title}
            </h1>
            <p className="text-slate-400">{config.description}</p>
            {tier === 4 && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                <Users className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-amber-300">SSO Enabled</span>
              </div>
            )}
          </div>

          {/* Authentication Status */}
          {authStage === 'ready' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint className={`w-6 h-6 ${colors.icon}`} />
                  <h2 className="text-xl font-semibold text-white">
                    {config.description}
                  </h2>
                </div>
                <p className="text-slate-300 text-sm mb-6">
                  {config.subDescription}
                </p>
                
                <button
                  onClick={handlePasskeyLogin}
                  className={`w-full ${colors.button} text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
                >
                  <Fingerprint className="w-5 h-5" />
                  Continue with Passkey
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Authenticating States */}
          {authStage === 'checking' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className={`w-6 h-6 ${colors.icon} animate-spin`} />
                  <h2 className="text-xl font-semibold text-white">
                    Checking for Passkey...
                  </h2>
                </div>
                <p className="text-slate-300 text-sm">
                  {tier === 4 ? 'Checking for SSO passkey credentials...' : 'Looking for registered passkeys on your device...'}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="w-full text-slate-400 hover:text-slate-300 text-sm py-2"
              >
                Cancel
              </button>
            </div>
          )}

          {authStage === 'verifying' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className={`w-6 h-6 ${colors.icon} animate-spin`} />
                  <h2 className="text-xl font-semibold text-white">
                    Verifying Passkey...
                  </h2>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  {tier === 4 
                    ? 'Please use your SSO passkey from your password manager to authenticate.'
                    : 'Please use your fingerprint, face recognition, or security key to authenticate.'}
                </p>
                <div className="flex justify-center">
                  <div className={`w-16 h-16 rounded-full border-4 ${colors.border} ${config.color === 'blue' ? 'border-t-blue-500' : config.color === 'purple' ? 'border-t-purple-500' : 'border-t-red-500'} animate-spin`}></div>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="w-full text-slate-400 hover:text-slate-300 text-sm py-2"
              >
                Cancel
              </button>
            </div>
          )}

          {authStage === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Authentication Successful!
                  </h2>
                </div>
                <p className="text-slate-300 text-sm">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-start gap-3 text-xs text-slate-400">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-300 mb-1">Secure Authentication</p>
                <p>
                  {tier === 2 && 'Tier 2: Driver Mobile App - In-app passkey authentication'}
                  {tier === 3 && 'Tier 3: Dispatcher Dashboard - WebAuthn passkey authentication'}
                  {tier === 4 && 'Tier 4: Admin Backend - SSO passkey via password manager'}
                </p>
                <p className="mt-1">This demo uses mock passkey authentication. In production, this would use WebAuthn API for true passkey verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
