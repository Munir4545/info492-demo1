'use client';

import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

export default function LogisticsPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAttackSimulation, setShowAttackSimulation] = useState(false);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setShowAttackSimulation(false);
  };

  const handleStartAttackSimulation = () => {
    setShowAttackSimulation(true);
    // Create a demo user for the attack simulation
    setUser({
      username: 'demo-user',
      role: 'Dispatcher',
      id: 'DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    });
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onStartAttackSimulation={handleStartAttackSimulation} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} showAttackSimulation={showAttackSimulation} />;
}

