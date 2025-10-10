'use client';

import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

export default function LogisticsPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAttackSimulation, setShowAttackSimulation] = useState(false);
  const [attackData, setAttackData] = useState({ fakeOrdersInjected: 0 });
  const [showDriversOnMap, setShowDriversOnMap] = useState(false);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setShowAttackSimulation(false);
    setAttackData({ fakeOrdersInjected: 0 });
    setShowDriversOnMap(false);
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

  const handleAttackDataChange = (newData) => {
    setAttackData(prevData => ({ ...prevData, ...newData }));
    if (newData.credentialsCompromised > 0) {
      setShowDriversOnMap(true);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onStartAttackSimulation={handleStartAttackSimulation} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} showAttackSimulation={showAttackSimulation} attackData={attackData} onAttackDataChange={handleAttackDataChange} />;
}

