
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import WelcomeScreen from '@/components/WelcomeScreen';
import AuthScreen from '@/components/AuthScreen';
import Calculator from '@/components/Calculator';
import LedgerScreen from '@/components/LedgerScreen';
import CustomersScreen from '@/components/CustomersScreen';
import InventoryScreen from '@/components/InventoryScreen';
import AnalyticsScreen from '@/components/AnalyticsScreen';
import ProfileScreen from '@/components/ProfileScreen';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { LogOut, Globe } from 'lucide-react';

const Index = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
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

  const getLanguageOptions = () => {
    switch (language) {
      case 'kn': return 'English';
      case 'hi': return 'ಕನ್ನಡ';
      case 'te': return 'हिंदी';
      default: return 'ಕನ್ನಡ';
    }
  };

  const cycleLanguage = () => {
    const languages: ('en' | 'kn' | 'hi' | 'te')[] = ['en', 'kn', 'hi', 'te'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

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
      case 'profile':
        return <ProfileScreen />;
      default:
        return <Calculator />;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/592c8570-e687-4d0b-b5c3-abd42466406b.png" 
              alt="VyapaarSetu Logo" 
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h1 className="text-lg font-bold text-primary">{t('appName')}</h1>
              <p className="text-sm text-gray-600">{t('welcome')}, {user.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleLanguage}
            >
              <Globe className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
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
      </div>

      {/* Main Content */}
      <div className="min-h-screen pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
