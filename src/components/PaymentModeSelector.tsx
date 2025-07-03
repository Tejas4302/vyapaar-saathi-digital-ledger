
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentModeSelectorProps {
  value: 'cash' | 'online' | 'udhaar';
  onChange: (mode: 'cash' | 'online' | 'udhaar') => void;
  className?: string;
}

const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({ value, onChange, className }) => {
  const { t } = useLanguage();

  const modes = [
    { value: 'cash' as const, label: t('cash') },
    { value: 'online' as const, label: t('online') },
    { value: 'udhaar' as const, label: t('credit') }
  ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          className={`
            flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm
            ${value === mode.value
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }
          `}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default PaymentModeSelector;
