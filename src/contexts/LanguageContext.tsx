
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'kn';
  setLanguage: (lang: 'en' | 'kn') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App Title
    appName: 'VyapaarSetu',
    welcome: 'Welcome',
    
    // Auth
    signUp: 'Sign Up',
    login: 'Login',
    logout: 'Logout',
    enterEmailOrPhone: 'Enter email or phone number',
    enterName: 'Enter your name',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    resendOTP: 'Resend OTP',
    
    // Navigation
    calculator: 'Calculator',
    ledger: 'Ledger',
    customers: 'Customers',
    inventory: 'Inventory',
    analytics: 'Analytics',
    profile: 'Profile',
    
    // Calculator
    cashIn: 'Cash In',
    cashOut: 'Cash Out',
    saveTransaction: 'Save Transaction',
    todaysSummary: "Today's Summary",
    sales: 'Sales',
    expenses: 'Expenses',
    net: 'Net',
    
    // Common
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    
    // Messages
    otpSent: 'OTP sent successfully',
    accountCreated: 'Account created successfully!',
    loginSuccessful: 'Login successful!',
    invalidOTP: 'Invalid OTP',
    transactionSaved: 'Transaction saved successfully!'
  },
  kn: {
    // App Title
    appName: 'ವ್ಯಾಪಾರಸೇತು',
    welcome: 'ಸ್ವಾಗತ',
    
    // Auth
    signUp: 'ನೋಂದಣಿ',
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗೌಟ್',
    enterEmailOrPhone: 'ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterName: 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ',
    enterOTP: 'OTP ನಮೂದಿಸಿ',
    sendOTP: 'OTP ಕಳುಹಿಸಿ',
    verifyOTP: 'OTP ಪರಿಶೀಲಿಸಿ',
    resendOTP: 'OTP ಮರು ಕಳುಹಿಸಿ',
    
    // Navigation
    calculator: 'ಲೆಕ್ಕಾಚಾರ',
    ledger: 'ಖಾತೆ ಪುಸ್ತಕ',
    customers: 'ಗ್ರಾಹಕರು',
    inventory: 'ಸ್ಟಾಕ್',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    profile: 'ಪ್ರೊಫೈಲ್',
    
    // Calculator
    cashIn: 'ಹಣ ಒಳಬರುವಿಕೆ',
    cashOut: 'ಹಣ ಹೊರಹೋಗುವಿಕೆ',
    saveTransaction: 'ವ್ಯವಹಾರ ಉಳಿಸಿ',
    todaysSummary: 'ಇಂದಿನ ಸಾರಾಂಶ',
    sales: 'ಮಾರಾಟ',
    expenses: 'ಖರ್ಚು',
    net: 'ನಿವ್ವಳ',
    
    // Common
    name: 'ಹೆಸರು',
    email: 'ಇಮೇಲ್',
    phone: 'ಫೋನ್',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    add: 'ಸೇರಿಸಿ',
    
    // Messages
    otpSent: 'OTP ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ',
    accountCreated: 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!',
    loginSuccessful: 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    invalidOTP: 'ಅಮಾನ್ಯ OTP',
    transactionSaved: 'ವ್ಯವಹಾರ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'kn'>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('vyapaar_language') as 'en' | 'kn';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'kn') => {
    setLanguage(lang);
    localStorage.setItem('vyapaar_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
