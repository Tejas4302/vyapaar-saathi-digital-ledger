
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'en' | 'kn';
  setLanguage: (lang: 'en' | 'kn') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App basics
    appName: 'VyapaarSetu',
    welcome: 'Welcome to',
    getStarted: 'Get Started',
    
    // Auth
    login: 'Login',
    signUp: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    name: 'Name',
    enterName: 'Enter your name',
    enterEmail: 'Enter your email',
    enterPhone: 'Enter your phone number',
    enterEmailOrPhone: 'Enter email or phone',
    enterPassword: 'Enter your password',
    createPassword: 'Create a password',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    otpSent: 'OTP sent successfully',
    loginSuccessful: 'Login successful',
    accountCreated: 'Account created successfully',
    
    // Navigation
    calculator: 'Calculator',
    ledger: 'Ledger',
    customers: 'Customers',
    inventory: 'Inventory',
    analytics: 'Analytics',
    profile: 'Profile',
    
    // Calculator
    clear: 'Clear',
    equals: 'Equals',
    enter: 'Enter',
    sale: 'Sale',
    purchase: 'Purchase',
    expense: 'Expense',
    income: 'Income',
    description: 'Description',
    amount: 'Amount',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    add: 'Add',
    total: 'Total',
  },
  kn: {
    // App basics
    appName: 'ವ್ಯಾಪಾರಸೇತು',
    welcome: 'ಸ್ವಾಗತ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    
    // Auth
    login: 'ಲಾಗಿನ್',
    signUp: 'ಸೈನ್ ಅಪ್',
    logout: 'ಲಾಗೌಟ್',
    email: 'ಇಮೇಲ್',
    phone: 'ಫೋನ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    name: 'ಹೆಸರು',
    enterName: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    enterEmail: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
    enterPhone: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterEmailOrPhone: 'ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ನಮೂದಿಸಿ',
    enterPassword: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    createPassword: 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ',
    sendOTP: 'OTP ಕಳುಹಿಸಿ',
    verifyOTP: 'OTP ಪರಿಶೀಲಿಸಿ',
    otpSent: 'OTP ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ',
    loginSuccessful: 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಯಿತು',
    accountCreated: 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ',
    
    // Navigation
    calculator: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    ledger: 'ಲೆಡ್ಜರ್',
    customers: 'ಗ್ರಾಹಕರು',
    inventory: 'ದಾಸ್ತಾನು',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    profile: 'ಪ್ರೊಫೈಲ್',
    
    // Calculator
    clear: 'ಸ್ಪಷ್ಟ',
    equals: 'ಸಮಾನ',
    enter: 'ನಮೂದಿಸಿ',
    sale: 'ಮಾರಾಟ',
    purchase: 'ಖರೀದಿ',
    expense: 'ವೆಚ್ಚ',
    income: 'ಆದಾಯ',
    description: 'ವಿವರಣೆ',
    amount: 'ಮೊತ್ತ',
    
    // Common
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    search: 'ಹುಡುಕಿ',
    add: 'ಸೇರಿಸಿ',
    total: 'ಒಟ್ಟು',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'kn'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
