
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
    { value: 'udhaar' as const, label: t('udhaar') }
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          className={`
            flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${value === mode.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
