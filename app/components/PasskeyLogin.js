'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, Shield, CheckCircle2, Loader2 } from 'lucide-react';

export default function PasskeyLogin({ onLoginSuccess }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState('ready'); // ready, checking, verifying, success
  const [error, setError] = useState(null);

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
          method: 'passkey',
          timestamp: new Date().toISOString(),
          user: 'demo@pnwlogistics.com'
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              PNW Logistics Op
            </h1>
            <p className="text-slate-400">Secure Passkey Authentication</p>
          </div>

          {/* Authentication Status */}
          {authStage === 'ready' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Sign in with Passkey
                  </h2>
                </div>
                <p className="text-slate-300 text-sm mb-6">
                  Use your device's biometric authentication or security key to sign in securely.
                </p>
                
                <button
                  onClick={handlePasskeyLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  <h2 className="text-xl font-semibold text-white">
                    Checking for Passkey...
                  </h2>
                </div>
                <p className="text-slate-300 text-sm">
                  Looking for registered passkeys on your device...
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
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  <h2 className="text-xl font-semibold text-white">
                    Verifying Passkey...
                  </h2>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  Please use your fingerprint, face recognition, or security key to authenticate.
                </p>
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
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
                <p>This demo uses mock passkey authentication. In production, this would use WebAuthn API for true passkey verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
