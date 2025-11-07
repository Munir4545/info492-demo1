import { useState, useEffect } from 'react';
import api from '../lib/api';

export const useAuth = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Token exists, but we don't have user info
    // In a real app, you'd verify the token and get user info
    setLoading(false);
  }, []);

  const login = async (username: string, passkeyMode: 'webauthn' | 'demo' = 'webauthn') => {
    try {
      if (passkeyMode === 'demo') {
        const token = 'demo-token-' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('token', token);
        setUser({ username: 'demo-user' });
        return { success: true };
      }

      // WebAuthn login flow
      const start = await api.post('/auth/login/start', { username });
      const options = start.data.options;

      // Convert to proper format for navigator.credentials
      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred: any) => ({
          ...cred,
          id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
        }));
      }

      const assertion: any = await navigator.credentials.get({ publicKey: options });

      const finish = await api.post('/auth/login/finish', {
        username,
        assertion: {
          id: assertion.id,
          rawId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId))),
          type: assertion.type,
          response: {
            authenticatorData: btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData))),
            clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON))),
            signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))),
            userHandle: assertion.response.userHandle ? btoa(String.fromCharCode(...new Uint8Array(assertion.response.userHandle))) : null,
          },
        },
      });

      const { token } = finish.data;
      localStorage.setItem('token', token);
      setUser({ username });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
};

