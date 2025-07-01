
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'en' | 'kn' | 'hi' | 'te';
  setLanguage: (lang: 'en' | 'kn' | 'hi' | 'te') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App basics
    appName: 'VyapaarSetu',
    welcome: 'Welcome',
    welcomeTo: 'Welcome to',
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
    cashIn: 'Cash In',
    cashOut: 'Cash Out',
    saveTransaction: 'Save Transaction',
    transactionSaved: 'Transaction saved successfully',
    todaysSummary: "Today's Summary",
    sales: 'Sales',
    expenses: 'Expenses',
    net: 'Net',
    
    // Payment modes
    cash: 'Cash',
    online: 'Online',
    udhaar: 'Udhaar',
    paymentMode: 'Payment Mode',
    
    // Voice features
    voiceInput: 'Voice Input',
    speak: 'Speak',
    listening: 'Listening...',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    add: 'Add',
    total: 'Total',
    showPassword: 'Show Password',
    hidePassword: 'Hide Password',
  },
  kn: {
    // App basics
    appName: 'ವ್ಯಾಪಾರಸೇತು',
    welcome: 'ಸ್ವಾಗತ',
    welcomeTo: 'ವ್ಯಾಪಾರಸೇತುವಿಗೆ ಸ್ವಾಗತ',
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
    cashIn: 'ಹಣ ಒಳಗೆ',
    cashOut: 'ಹಣ ಹೊರಗೆ',
    saveTransaction: 'ವ್ಯವಹಾರ ಉಳಿಸಿ',
    transactionSaved: 'ವ್ಯವಹಾರ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ',
    todaysSummary: 'ಇಂದಿನ ಸಾರಾಂಶ',
    sales: 'ಮಾರಾಟ',
    expenses: 'ವೆಚ್ಚಗಳು',
    net: 'ನಿವ್ವಳ',
    
    // Payment modes
    cash: 'ನಗದು',
    online: 'ಆನ್‌ಲೈನ್',
    udhaar: 'ಉಧಾರ',
    paymentMode: 'ಪಾವತಿ ವಿಧಾನ',
    
    // Voice features
    voiceInput: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್',
    speak: 'ಮಾತನಾಡಿ',
    listening: 'ಕೇಳುತ್ತಿದೆ...',
    
    // Common
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    search: 'ಹುಡುಕಿ',
    add: 'ಸೇರಿಸಿ',
    total: 'ಒಟ್ಟು',
    showPassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
    hidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
  },
  hi: {
    // App basics
    appName: 'व्यापारसेतु',
    welcome: 'स्वागत',
    welcomeTo: 'व्यापारसेतु में आपका स्वागत है',
    getStarted: 'शुरू करें',
    
    // Auth
    login: 'लॉगिन',
    signUp: 'साइन अप',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    phone: 'फोन',
    password: 'पासवर्ड',
    name: 'नाम',
    enterName: 'अपना नाम दर्ज करें',
    enterEmail: 'अपना ईमेल दर्ज करें',
    enterPhone: 'अपना फोन नंबर दर्ज करें',
    enterEmailOrPhone: 'ईमेल या फोन दर्ज करें',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    createPassword: 'पासवर्ड बनाएं',
    sendOTP: 'OTP भेजें',
    verifyOTP: 'OTP सत्यापित करें',
    otpSent: 'OTP सफलतापूर्वक भेजा गया',
    loginSuccessful: 'लॉगिन सफल',
    accountCreated: 'खाता सफलतापूर्वक बनाया गया',
    
    // Navigation
    calculator: 'कैलकुलेटर',
    ledger: 'खाता बही',
    customers: 'ग्राहक',
    inventory: 'इन्वेंटरी',
    analytics: 'विश्लेषण',
    profile: 'प्रोफाइल',
    
    // Calculator
    clear: 'साफ़ करें',
    equals: 'बराबर',
    enter: 'दर्ज करें',
    sale: 'बिक्री',
    purchase: 'खरीदारी',
    expense: 'खर्च',
    income: 'आय',
    description: 'विवरण',
    amount: 'राशि',
    cashIn: 'नकद आय',
    cashOut: 'नकद व्यय',
    saveTransaction: 'लेनदेन सहेजें',
    transactionSaved: 'लेनदेन सफलतापूर्वक सहेजा गया',
    todaysSummary: 'आज का सारांश',
    sales: 'बिक्री',
    expenses: 'खर्च',
    net: 'शुद्ध',
    
    // Payment modes
    cash: 'नकद',
    online: 'ऑनलाइन',
    udhaar: 'उधार',
    paymentMode: 'भुगतान विधि',
    
    // Voice features
    voiceInput: 'आवाज़ इनपुट',
    speak: 'बोलें',
    listening: 'सुन रहा है...',
    
    // Common
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    search: 'खोजें',
    add: 'जोड़ें',
    total: 'कुल',
    showPassword: 'पासवर्ड दिखाएं',
    hidePassword: 'पासवर्ड छुपाएं',
  },
  te: {
    // App basics
    appName: 'వ్యాపారసేతు',
    welcome: 'స్వాగతం',
    welcomeTo: 'వ్యాపారసేతుకి స్వాగతం',
    getStarted: 'ప్రారంభించండి',
    
    // Auth
    login: 'లాగిన్',
    signUp: 'సైన్ అప్',
    logout: 'లాగౌట్',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్',
    password: 'పాస్‌వర్డ్',
    name: 'పేరు',
    enterName: 'మీ పేరు నమోదు చేయండి',
    enterEmail: 'మీ ఇమెయిల్ నమోదు చేయండి',
    enterPhone: 'మీ ఫోన్ నంబర్ నమోదు చేయండి',
    enterEmailOrPhone: 'ఇమెయిల్ లేదా ఫోన్ నమోదు చేయండి',
    enterPassword: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
    createPassword: 'పాస్‌వర్డ్ సృష్టించండి',
    sendOTP: 'OTP పంపండి',
    verifyOTP: 'OTP ధృవీకరించండి',
    otpSent: 'OTP విజయవంతంగా పంపబడింది',
    loginSuccessful: 'లాగిన్ విజయవంతం',
    accountCreated: 'ఖాతా విజయవంతంగా సృష్టించబడింది',
    
    // Navigation
    calculator: 'కాలిక్యులేటర్',
    ledger: 'లెడ్జర్',
    customers: 'కస్టమర్లు',
    inventory: 'ఇన్వెంటరీ',
    analytics: 'విశ్లేషణలు',
    profile: 'ప్రొఫైల్',
    
    // Calculator
    clear: 'క్లియర్',
    equals: 'సమానం',
    enter: 'ఎంటర్',
    sale: 'అమ్మకం',
    purchase: 'కొనుగోలు',
    expense: 'ఖర్చు',
    income: 'ఆదాయం',
    description: 'వివరణ',
    amount: 'మొత్తం',
    cashIn: 'నగదు ఆదాయం',
    cashOut: 'నగదు ఖర్చు',
    saveTransaction: 'లావాదేవీ సేవ్ చేయండి',
    transactionSaved: 'లావాదేవీ విజయవంతంగా సేవ్ చేయబడింది',
    todaysSummary: 'నేటి సారాంశం',
    sales: 'అమ్మకాలు',
    expenses: 'ఖర్చులు',
    net: 'నెట్',
    
    // Payment modes
    cash: 'నగదు',
    online: 'ఆన్‌లైన్',
    udhaar: 'ఉధార్',
    paymentMode: 'చెల్లింపు విధానం',
    
    // Voice features
    voiceInput: 'వాయిస్ ఇన్‌పుట్',
    speak: 'మాట్లాడండి',
    listening: 'వింటోంది...',
    
    // Common
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    edit: 'ఎడిట్ చేయండి',
    delete: 'తొలగించండి',
    search: 'వెతకండి',
    add: 'జోడించండి',
    total: 'మొత్తం',
    showPassword: 'పాస్‌వర్డ్ చూపించండి',
    hidePassword: 'పాస్‌వర్డ్ దాచండి',
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
  const [language, setLanguage] = useState<'en' | 'kn' | 'hi' | 'te'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
