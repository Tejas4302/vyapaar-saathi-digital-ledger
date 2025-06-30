
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeScreen from '@/components/WelcomeScreen';
import AuthScreen from '@/components/AuthScreen';
import Calculator from '@/components/Calculator';
import LedgerScreen from '@/components/LedgerScreen';
import CustomersScreen from '@/components/CustomersScreen';
import InventoryScreen from '@/components/InventoryScreen';
import AnalyticsScreen from '@/components/AnalyticsScreen';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(!user);
  const [activeTab, setActiveTab] = useState('calculator');

  // Show welcome screen for new users
  if (showWelcome && !user) {
    return <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />;
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  // Main app interface
  const renderScreen = () => {
    switch (activeTab) {
      case 'calculator':
        return <Calculator />;
      case 'ledger':
        return <LedgerScreen />;
      case 'customers':
        return <CustomersScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      default:
        return <Calculator />;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary">VyapaarSetu</h1>
            <p className="text-sm text-gray-600">Welcome, {user.name}!</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
