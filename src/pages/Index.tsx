
import React, { useState, useEffect } from 'react';
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
import LanguageDropdown from '@/components/LanguageDropdown';
import ProductTour from '@/components/ProductTour';
import ProfileButton from '@/components/ProfileButton';

const Index = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(!user);
  const [activeTab, setActiveTab] = useState('calculator');
  const [showProductTour, setShowProductTour] = useState(false);

  // Check if user is new and should see product tour
  useEffect(() => {
    if (user) {
      const hasSeenTour = localStorage.getItem(`tour_seen_${user.id}`);
      if (!hasSeenTour) {
        setShowProductTour(true);
      }
    }
  }, [user]);

  const handleTourClose = () => {
    setShowProductTour(false);
    if (user) {
      localStorage.setItem(`tour_seen_${user.id}`, 'true');
    }
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

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
      case 'profile':
        return <ProfileScreen onStartTour={() => setShowProductTour(true)} />;
      default:
        return <Calculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Mobile Header */}
      <div className="mobile-header safe-area-top">
        <div className="flex items-center justify-between w-full max-w-full px-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img 
              src="/lovable-uploads/592c8570-e687-4d0b-b5c3-abd42466406b.png" 
              alt="VyapaarSetu Logo" 
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 className="title-text text-lg truncate">{t('appName')}</h1>
              <p className="subtitle-text text-xs truncate">{t('welcome')}, {profile?.name || t('user')}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <LanguageDropdown />
            <ProfileButton onProfileClick={handleProfileClick} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mobile-content w-full">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Product Tour */}
      <ProductTour isOpen={showProductTour} onClose={handleTourClose} />
    </div>
  );
};

export default Index;
