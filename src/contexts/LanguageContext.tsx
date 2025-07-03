
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'kn' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App basics
    appName: 'VyapaarSetu',
    welcome: 'Welcome',
    user: 'User',
    
    // Authentication
    signUp: 'Sign Up',
    signIn: 'Sign In',
    logout: 'Logout',
    name: 'Name',
    phone: 'Phone Number',
    storeName: 'Store Name',
    enterName: 'Enter your name',
    enterPhone: 'Enter Phone Number',
    enterStoreName: 'Enter store name (optional)',
    
    // Calculator & Transactions
    calculator: 'Calculator',
    transaction: 'Transaction',
    cashIn: 'Cash In',
    cashOut: 'Cash Out',
    paid: 'Paid',
    credit: 'Credit',
    cash: 'Cash',
    online: 'Online',
    paymentMode: 'Payment Mode',
    selectCustomer: 'Select Customer',
    selectItem: 'Select Item',
    addNote: 'Add Note',
    save: 'Save',
    print: 'Print Bill',
    
    // Customer management
    customers: 'Customers',
    addCustomer: 'Add Customer',
    customerName: 'Customer Name',
    phoneNumber: 'Phone Number',
    
    // Inventory
    inventory: 'Inventory',
    addItem: 'Add Item',
    itemName: 'Item Name',
    category: 'Category',
    unit: 'Unit',
    currentStock: 'Current Stock',
    purchasePricePer: 'Purchase Price per',
    sellingPricePer: 'Selling Price per',
    lowStockThreshold: 'Low Stock Threshold',
    
    // General
    ledger: 'Ledger',
    analytics: 'Analytics',
    profile: 'Profile',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
    // Messages
    pleaseEnterValidAmount: 'Please enter a valid amount',
    transactionSaved: 'Transaction saved successfully',
    failedToSaveTransaction: 'Failed to save transaction',
    
    // Units
    pieces: 'Pieces',
    kg: 'Kg',
    liters: 'Liters',
    boxes: 'Boxes'
  },
  kn: {
    // App basics
    appName: 'ವ್ಯಾಪಾರ ಸೇತು',
    welcome: 'ಸ್ವಾಗತ',
    user: 'ಬಳಕೆದಾರ',
    
    // Authentication
    signUp: 'ನೋಂದಣಿ',
    signIn: 'ಪ್ರವೇಶ',
    logout: 'ನಿರ್ಗಮನ',
    name: 'ಹೆಸರು',
    phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    storeName: 'ಅಂಗಡಿಯ ಹೆಸರು',
    enterName: 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ',
    enterPhone: 'ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterStoreName: 'ಅಂಗಡಿಯ ಹೆಸರು ನಮೂದಿಸಿ (ಐಚ್ಛಿಕ)',
    
    // Calculator & Transactions
    calculator: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    transaction: 'ವ್ಯವಹಾರ',
    cashIn: 'ಹಣ ಒಳಬರುವಿಕೆ',
    cashOut: 'ಹಣ ಹೊರಹೋಗುವಿಕೆ',
    paid: 'ಪಾವತಿಸಲಾಗಿದೆ',
    credit: 'ಸಾಲ',
    cash: 'ನಗದು',
    online: 'ಆನ್‌ಲೈನ್',
    paymentMode: 'ಪಾವತಿ ವಿಧಾನ',
    selectCustomer: 'ಗ್ರಾಹಕರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    selectItem: 'ವಸ್ತುವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    addNote: 'ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ',
    save: 'ಉಳಿಸಿ',
    print: 'ಬಿಲ್ ಮುದ್ರಿಸಿ',
    
    // Customer management
    customers: 'ಗ್ರಾಹಕರು',
    addCustomer: 'ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ',
    customerName: 'ಗ್ರಾಹಕರ ಹೆಸರು',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    
    // Inventory
    inventory: 'ದಾಸ್ತಾನು',
    addItem: 'ವಸ್ತು ಸೇರಿಸಿ',
    itemName: 'ವಸ್ತುವಿನ ಹೆಸರು',
    category: 'ವರ್ಗ',
    unit: 'ಘಟಕ',
    currentStock: 'ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್',
    purchasePricePer: 'ಪ್ರತಿ ಖರೀದಿ ಬೆಲೆ',
    sellingPricePer: 'ಪ್ರತಿ ಮಾರಾಟ ಬೆಲೆ',
    lowStockThreshold: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಮಿತಿ',
    
    // General
    ledger: 'ಖಾತೆ ಪುಸ್ತಕ',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    profile: 'ಪ್ರೊಫೈಲ್',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    confirm: 'ದೃಢೀಕರಿಸಿ',
    
    // Messages
    pleaseEnterValidAmount: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    transactionSaved: 'ವ್ಯವಹಾರ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ',
    failedToSaveTransaction: 'ವ್ಯವಹಾರ ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ',
    
    // Units
    pieces: 'ತುಣುಕುಗಳು',
    kg: 'ಕೆಜಿ',
    liters: 'ಲೀಟರ್',
    boxes: 'ಪೆಟ್ಟಿಗೆಗಳು'
  },
  hi: {
    // App basics
    appName: 'व्यापार सेतु',
    welcome: 'स्वागत',
    user: 'उपयोगकर्ता',
    
    // Authentication
    signUp: 'साइन अप',
    signIn: 'साइन इन',
    logout: 'लॉग आउट',
    name: 'नाम',
    phone: 'फोन नंबर',
    storeName: 'दुकान का नाम',
    enterName: 'अपना नाम दर्ज करें',
    enterPhone: 'फोन नंबर दर्ज करें',
    enterStoreName: 'दुकान का नाम दर्ज करें (वैकल्पिक)',
    
    // Calculator & Transactions
    calculator: 'कैलकुलेटर',
    transaction: 'लेन-देन',
    cashIn: 'नकद आय',
    cashOut: 'नकद व्यय',
    paid: 'भुगतान किया गया',
    credit: 'उधार',
    cash: 'नकद',
    online: 'ऑनलाइन',
    paymentMode: 'भुगतान मोड',
    selectCustomer: 'ग्राहक चुनें',
    selectItem: 'वस्तु चुनें',
    addNote: 'नोट जोड़ें',
    save: 'सेव करें',
    print: 'बिल प्रिंट करें',
    
    // Customer management
    customers: 'ग्राहक',
    addCustomer: 'ग्राहक जोड़ें',
    customerName: 'ग्राहक का नाम',
    phoneNumber: 'फोन नंबर',
    
    // Inventory
    inventory: 'इन्वेंटरी',
    addItem: 'वस्तु जोड़ें',
    itemName: 'वस्तु का नाम',
    category: 'श्रेणी',
    unit: 'इकाई',
    currentStock: 'वर्तमान स्टॉक',
    purchasePricePer: 'प्रति खरीद मूल्य',
    sellingPricePer: 'प्रति बिक्री मूल्य',
    lowStockThreshold: 'कम स्टॉक सीमा',
    
    // General
    ledger: 'खाता बही',
    analytics: 'एनालिटिक्स',
    profile: 'प्रोफाइल',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    
    // Messages
    pleaseEnterValidAmount: 'कृपया एक मान्य राशि दर्ज करें',
    transactionSaved: 'लेन-देन सफलतापूर्वक सेव किया गया',
    failedToSaveTransaction: 'लेन-देन सेव करने में विफल',
    
    // Units
    pieces: 'टुकड़े',
    kg: 'किग्रा',
    liters: 'लीटर',
    boxes: 'बक्से'
  },
  te: {
    // App basics
    appName: 'వ్యాపార సేతు',
    welcome: 'స్వాగతం',
    user: 'వినియోగదారు',
    
    // Authentication
    signUp: 'సైన్ అప్',
    signIn: 'సైన్ ఇన్',
    logout: 'లాగ్ అవుట్',
    name: 'పేరు',
    phone: 'ఫోన్ నంబర్',
    storeName: 'దుకాణం పేరు',
    enterName: 'మీ పేరు నమోదు చేయండి',
    enterPhone: 'ఫోన్ నంబర్ నమోదు చేయండి',
    enterStoreName: 'దుకాణం పేరు నమోదు చేయండి (ఐచ్ఛికం)',
    
    // Calculator & Transactions
    calculator: 'కాలిక్యులేటర్',
    transaction: 'లావాదేవీ',
    cashIn: 'నగదు రాబడి',
    cashOut: 'నగదు ఖర్చు',
    paid: 'చెల్లించబడింది',
    credit: 'అప్పు',
    cash: 'నగదు',
    online: 'ఆన్‌లైన్',
    paymentMode: 'చెల్లింపు మోడ్',
    selectCustomer: 'కస్టమర్ ఎంచుకోండి',
    selectItem: 'వస్తువు ఎంచుకోండి',
    addNote: 'గమనిక జోడించండి',
    save: 'సేవ్ చేయండి',
    print: 'బిల్ ప్రింట్ చేయండి',
    
    // Customer management
    customers: 'కస్టమర్లు',
    addCustomer: 'కస్టమర్ జోడించండి',
    customerName: 'కస్టమర్ పేరు',
    phoneNumber: 'ఫోన్ నంబర్',
    
    // Inventory
    inventory: 'ఇన్వెంటరీ',
    addItem: 'వస్తువు జోడించండి',
    itemName: 'వస్తువు పేరు',
    category: 'వర్గం',
    unit: 'యూనిట్',
    currentStock: 'ప్రస్తుత స్టాక్',
    purchasePricePer: 'ప్రతి కొనుగోలు ధర',
    sellingPricePer: 'ప్రతి అమ్మకం ధర',
    lowStockThreshold: 'తక్కువ స్టాక్ పరిమితి',
    
    // General
    ledger: 'లెడ్జర్',
    analytics: 'అనలిటిక్స్',
    profile: 'ప్రొఫైల్',
    edit: 'సవరించు',
    delete: 'తొలగించు',
    cancel: 'రద్దు చేయు',
    confirm: 'నిర్ధారించు',
    
    // Messages
    pleaseEnterValidAmount: 'దయచేసి చెల్లుబాటు అయ్యే మొత్తాన్ని నమోదు చేయండి',
    transactionSaved: 'లావాదేవీ విజయవంతంగా సేవ్ చేయబడింది',
    failedToSaveTransaction: 'లావాదేవీ సేవ్ చేయడంలో విఫలమైంది',
    
    // Units
    pieces: 'ముక్కలు',
    kg: 'కేజీ',
    liters: 'లీటర్లు',
    boxes: 'పెట్టెలు'
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

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
