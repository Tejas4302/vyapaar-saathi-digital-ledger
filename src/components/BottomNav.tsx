
import React from 'react';
import { Calculator, BookOpen, Users, Package, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'calculator', icon: Calculator, label: t('calculator') },
    { id: 'ledger', icon: BookOpen, label: t('ledger') },
    { id: 'customers', icon: Users, label: t('customers') },
    { id: 'inventory', icon: Package, label: t('inventory') },
    { id: 'analytics', icon: BarChart3, label: t('analytics') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 safe-area-bottom z-50 max-w-full mx-auto">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-500 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium text-proper">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
