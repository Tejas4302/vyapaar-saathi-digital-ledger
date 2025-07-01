
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageDropdown: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'te', label: 'తెలుగు' }
  ];

  const getCurrentLanguageLabel = () => {
    return languageOptions.find(option => option.value === language)?.label || 'English';
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <Select value={language} onValueChange={(value: 'en' | 'kn' | 'hi' | 'te') => setLanguage(value)}>
        <SelectTrigger className="w-auto min-w-[100px] border-none shadow-none">
          <SelectValue>{getCurrentLanguageLabel()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageDropdown;
