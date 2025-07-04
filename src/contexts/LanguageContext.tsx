
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi' | 'kn' | 'te';
  setLanguage: (lang: 'en' | 'hi' | 'kn' | 'te') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // App basics
    appName: 'VyapaarSetu',
    welcome: 'Welcome',
    user: 'User',
    getStarted: 'Get Started',
    
    // Navigation
    calculator: 'Calculator',
    ledger: 'Ledger',
    customers: 'Customers',
    inventory: 'Inventory',
    analytics: 'Analytics',
    profile: 'Profile',
    
    // Transaction types
    cashIn: 'Cash In',
    cashOut: 'Cash Out',
    transaction: 'Transaction',
    
    // Payment modes
    paymentMode: 'Payment Mode',
    cash: 'Cash',
    online: 'Online',
    credit: 'Credit',
    
    // Form fields
    selectCustomer: 'Select Customer',
    selectItem: 'Select Item',
    addNote: 'Add Note',
    enterName: 'Enter Name',
    enterPhone: 'Enter Phone Number',
    enterStoreName: 'Enter Store Name',
    
    // Actions
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    print: 'Print',
    add: 'Add',
    update: 'Update',
    
    // Status messages
    transactionSaved: 'Transaction Saved',
    pleaseEnterValidAmount: 'Please Enter Valid Amount',
    failedToSaveTransaction: 'Failed To Save Transaction',
    profileUpdated: 'Profile Updated',
    errorUpdatingProfile: 'Error Updating Profile',
    logoutSuccessful: 'Logout Successful',
    
    // Inventory
    itemName: 'Item Name',
    category: 'Category',
    purchasePrice: 'Purchase Price',
    sellingPrice: 'Selling Price',
    currentStock: 'Current Stock',
    lowStockThreshold: 'Low Stock Threshold',
    unit: 'Unit',
    pieces: 'Pieces',
    kg: 'Kg',
    liters: 'Liters',
    purchasePricePer: 'Purchase Price Per',
    sellingPricePer: 'Selling Price Per',
    
    // Profile
    profileDetails: 'Profile Details',
    settings: 'Settings',
    productTour: 'Product Tour',
    name: 'Name',
    phone: 'Phone',
    storeName: 'Store Name',
    notSet: 'Not Set',
    noStoreNameSet: 'No Store Name Set',
    logout: 'Logout',
    
    // Analytics
    sales: 'Sales',
    expenses: 'Expenses',
    profit: 'Profit',
    margin: 'Margin',
    transactions: 'Transactions',
    outstanding: 'Outstanding',
    lowStock: 'Low Stock',
    dailySales: 'Daily Sales',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    topTransactionAmounts: 'Top Transaction Amounts',
    times: 'Times',
    totalUdhaar: 'Total Credit',
    itemsRunningLow: 'Items Running Low',
    quickInsights: 'Quick Insights',
    businessProfitable: 'Business Profitable',
    expensesExceeded: 'Expenses Exceeded',
    youHave: 'You Have',
    inPendingPayments: 'In Pending Payments',
    itemsNeedRestocking: 'Items Need Restocking',
    noTransactionsRecorded: 'No Transactions Recorded'
  },
  hi: {
    // App basics
    appName: 'व्यापारसेतु',
    welcome: 'स्वागत',
    user: 'उपयोगकर्ता',
    getStarted: 'शुरू करें',
    
    // Navigation
    calculator: 'कैलकुलेटर',
    ledger: 'खाता बही',
    customers: 'ग्राहक',
    inventory: 'स्टॉक',
    analytics: 'विश्लेषण',
    profile: 'प्रोफाइल',
    
    // Transaction types
    cashIn: 'पैसा आया',
    cashOut: 'पैसा गया',
    transaction: 'लेन-देन',
    
    // Payment modes
    paymentMode: 'भुगतान का तरीका',
    cash: 'नकद',
    online: 'ऑनलाइन',
    credit: 'उधार',
    
    // Form fields
    selectCustomer: 'ग्राहक चुनें',
    selectItem: 'सामान चुनें',
    addNote: 'नोट जोड़ें',
    enterName: 'नाम दर्ज करें',
    enterPhone: 'फोन नंबर दर्ज करें',
    enterStoreName: 'दुकान का नाम दर्ज करें',
    
    // Actions
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    cancel: 'रद्द करें',
    print: 'प्रिंट करें',
    add: 'जोड़ें',
    update: 'अपडेट करें',
    
    // Status messages
    transactionSaved: 'लेन-देन सेव हो गया',
    pleaseEnterValidAmount: 'कृपया सही राशि दर्ज करें',
    failedToSaveTransaction: 'लेन-देन सेव नहीं हुआ',
    profileUpdated: 'प्रोफाइल अपडेट हो गया',
    errorUpdatingProfile: 'प्रोफाइल अपडेट में त्रुटि',
    logoutSuccessful: 'सफलतापूर्वक लॉगआउट',
    
    // Inventory
    itemName: 'सामान का नाम',
    category: 'श्रेणी',
    purchasePrice: 'खरीद मूल्य',
    sellingPrice: 'बिक्री मूल्य',
    currentStock: 'मौजूदा स्टॉक',
    lowStockThreshold: 'कम स्टॉक सीमा',
    unit: 'इकाई',
    pieces: 'पीस',
    kg: 'किलो',
    liters: 'लीटर',
    purchasePricePer: 'खरीद मूल्य प्रति',
    sellingPricePer: 'बिक्री मूल्य प्रति',
    
    // Profile
    profileDetails: 'प्रोफाइल विवरण',
    settings: 'सेटिंग्स',
    productTour: 'प्रोडक्ट टूर',
    name: 'नाम',
    phone: 'फोन',
    storeName: 'दुकान का नाम',
    notSet: 'सेट नहीं है',
    noStoreNameSet: 'दुकान का नाम सेट नहीं है',
    logout: 'लॉगआउट',
    
    // Analytics
    sales: 'बिक्री',
    expenses: 'खर्च',
    profit: 'मुनाफा',
    margin: 'मार्जिन',
    transactions: 'लेन-देन',
    outstanding: 'बकाया',
    lowStock: 'कम स्टॉक',
    dailySales: 'दैनिक बिक्री',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
    topTransactionAmounts: 'शीर्ष लेन-देन राशि',
    times: 'बार',
    totalUdhaar: 'कुल उधार',
    itemsRunningLow: 'कम होते सामान',
    quickInsights: 'त्वरित अंतर्दृष्टि',
    businessProfitable: 'व्यापार लाभदायक',
    expensesExceeded: 'खर्च अधिक',
    youHave: 'आपके पास',
    inPendingPayments: 'बकाया भुगतान में',
    itemsNeedRestocking: 'सामान भरना जरूरी',
    noTransactionsRecorded: 'कोई लेन-देन दर्ज नहीं'
  },
  kn: {
    // App basics
    appName: 'ವ್ಯಾಪಾರಸೇತು',
    welcome: 'ಸ್ವಾಗತ',
    user: 'ಬಳಕೆದಾರ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    
    // Navigation
    calculator: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    ledger: 'ಖಾತೆ ಪುಸ್ತಕ',
    customers: 'ಗ್ರಾಹಕರು',
    inventory: 'ದಾಸ್ತಾನು',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    profile: 'ಪ್ರೊಫೈಲ್',
    
    // Transaction types
    cashIn: 'ಹಣ ಬಂದಿತು',
    cashOut: 'ಹಣ ಹೋಗಿದೆ',
    transaction: 'ವ್ಯವಹಾರ',
    
    // Payment modes
    paymentMode: 'ಪಾವತಿ ವಿಧಾನ',
    cash: 'ನಗದು',
    online: 'ಆನ್‌ಲೈನ್',
    credit: 'ಸಾಲ',
    
    // Form fields
    selectCustomer: 'ಗ್ರಾಹಕರನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectItem: 'ವಸ್ತುವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    addNote: 'ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ',
    enterName: 'ಹೆಸರು ನಮೂದಿಸಿ',
    enterPhone: 'ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterStoreName: 'ಅಂಗಡಿಯ ಹೆಸರು ನಮೂದಿಸಿ',
    
    // Actions
    save: 'ಉಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    print: 'ಮುದ್ರಿಸಿ',
    add: 'ಸೇರಿಸಿ',
    update: 'ನವೀಕರಿಸಿ',
    
    // Status messages
    transactionSaved: 'ವ್ಯವಹಾರ ಉಳಿಸಲಾಗಿದೆ',
    pleaseEnterValidAmount: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    failedToSaveTransaction: 'ವ್ಯವಹಾರ ಉಳಿಸಲು ವಿಫಲವಾಯಿತು',
    profileUpdated: 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ',
    errorUpdatingProfile: 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸುವಲ್ಲಿ ದೋಷ',
    logoutSuccessful: 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ಔಟ್',
    
    // Inventory
    itemName: 'ವಸ್ತುವಿನ ಹೆಸರು',
    category: 'ವರ್ಗ',
    purchasePrice: 'ಖರೀದಿ ಬೆಲೆ',
    sellingPrice: 'ಮಾರಾಟ ಬೆಲೆ',
    currentStock: 'ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್',
    lowStockThreshold: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಮಿತಿ',
    unit: 'ಘಟಕ',
    pieces: 'ತುಂಡುಗಳು',
    kg: 'ಕೆಜಿ',
    liters: 'ಲೀಟರ್',
    purchasePricePer: 'ಖರೀದಿ ಬೆಲೆ ಪ್ರತಿ',
    sellingPricePer: 'ಮಾರಾಟ ಬೆಲೆ ಪ್ರತಿ',
    
    // Profile
    profileDetails: 'ಪ್ರೊಫೈಲ್ ವಿವರಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    productTour: 'ಉತ್ಪನ್ನ ಪ್ರವಾಸ',
    name: 'ಹೆಸರು',
    phone: 'ಫೋನ್',
    storeName: 'ಅಂಗಡಿಯ ಹೆಸರು',
    notSet: 'ಸೆಟ್ ಮಾಡಿಲ್ಲ',
    noStoreNameSet: 'ಅಂಗಡಿಯ ಹೆಸರು ಸೆಟ್ ಮಾಡಿಲ್ಲ',
    logout: 'ಲಾಗ್ಔಟ್',
    
    // Analytics
    sales: 'ಮಾರಾಟ',
    expenses: 'ವೆಚ್ಚಗಳು',
    profit: 'ಲಾಭ',
    margin: 'ಮಾರ್ಜಿನ್',
    transactions: 'ವ್ಯವಹಾರಗಳು',
    outstanding: 'ಬಾಕಿ',
    lowStock: 'ಕಡಿಮೆ ಸ್ಟಾಕ್',
    dailySales: 'ದೈನಂದಿನ ಮಾರಾಟ',
    thisWeek: 'ಈ ವಾರ',
    thisMonth: 'ಈ ತಿಂಗಳು',
    topTransactionAmounts: 'ಟಾಪ್ ವ್ಯವಹಾರ ಮೊತ್ತಗಳು',
    times: 'ಬಾರಿ',
    totalUdhaar: 'ಒಟ್ಟು ಸಾಲ',
    itemsRunningLow: 'ಕಡಿಮೆಯಾಗುತ್ತಿರುವ ವಸ್ತುಗಳು',
    quickInsights: 'ತ್ವರಿತ ಅಂತರ್ದೃಷ್ಟಿ',
    businessProfitable: 'ವ್ಯವಹಾರ ಲಾಭದಾಯಕ',
    expensesExceeded: 'ವೆಚ್ಚಗಳು ಮೀರಿದೆ',
    youHave: 'ನೀವು ಹೊಂದಿದ್ದೀರಿ',
    inPendingPayments: 'ಬಾಕಿ ಪಾವತಿಗಳಲ್ಲಿ',
    itemsNeedRestocking: 'ವಸ್ತುಗಳಿಗೆ ಮರುಸ್ಟಾಕ್ ಅಗತ್ಯ',
    noTransactionsRecorded: 'ಯಾವುದೇ ವ್ಯವಹಾರಗಳು ದಾಖಲಿಸಿಲ್ಲ'
  },
  te: {
    // App basics
    appName: 'వ్యాపారసేతు',
    welcome: 'స్వాగతం',
    user: 'వినియోగదారు',
    getStarted: 'ప్రారంభించండి',
    
    // Navigation
    calculator: 'కాలిక్యులేటర్',
    ledger: 'లెడ్జర్',
    customers: 'కస్టమర్లు',
    inventory: 'ఇన్వెంటరీ',
    analytics: 'విశ్లేషణలు',
    profile: 'ప్రొఫైల్',
    
    // Transaction types
    cashIn: 'డబ్బు వచ్చింది',
    cashOut: 'డబ్బు వెళ్ళింది',
    transaction: 'లావాదేవీ',
    
    // Payment modes
    paymentMode: 'చెల్లింపు విధానం',
    cash: 'నగదు',
    online: 'ఆన్‌లైన్',
    credit: 'అప్పు',
    
    // Form fields
    selectCustomer: 'కస్టమర్‌ను ఎంచుకోండి',
    selectItem: 'వస్తువును ఎంచుకోండి',
    addNote: 'గమనిక జోడించండి',
    enterName: 'పేరు నమోదు చేయండి',
    enterPhone: 'ఫోన్ నంబర్ నమోదు చేయండి',
    enterStoreName: 'దుకాణం పేరు నమోదు చేయండి',
    
    // Actions
    save: 'సేవు చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    cancel: 'రద్దు చేయండి',
    print: 'ప్రింట్ చేయండి',
    add: 'జోడించండి',
    update: 'నవీకరించండి',
    
    // Status messages
    transactionSaved: 'లావాదేవీ సేవు చేయబడింది',
    pleaseEnterValidAmount: 'దయచేసి సరైన మొత్తాన్ని నమోదు చేయండి',
    failedToSaveTransaction: 'లావాదేవీ సేవు చేయడంలో విఫలమైంది',
    profileUpdated: 'ప్రొఫైల్ నవీకరించబడింది',
    errorUpdatingProfile: 'ప్రొఫైల్ నవీకరించడంలో లోపం',
    logoutSuccessful: 'విజయవంతంగా లాగ్‌అవుట్',
    
    // Inventory
    itemName: 'వస్తువు పేరు',
    category: 'వర్గం',
    purchasePrice: 'కొనుగోలు ధర',
    sellingPrice: 'అమ్మకం ధర',
    currentStock: 'ప్రస్తుత స్టాక్',
    lowStockThreshold: 'తక్కువ స్టాక్ పరిమితి',
    unit: 'యూనిట్',
    pieces: 'ముక్కలు',
    kg: 'కేజీ',
    liters: 'లీటర్',
    purchasePricePer: 'కొనుగోలు ధర ప్రతి',
    sellingPricePer: 'అమ్మకం ధర ప్రతి',
    
    // Profile
    profileDetails: 'ప్రొఫైల్ వివరాలు',
    settings: 'సెట్టింగ్‌లు',
    productTour: 'ఉత్పత్తి పర్యటన',
    name: 'పేరు',
    phone: 'ఫోన్',
    storeName: 'దుకాణం పేరు',
    notSet: 'సెట్ చేయలేదు',
    noStoreNameSet: 'దుకాణం పేరు సెట్ చేయలేదు',
    logout: 'లాగ్‌అవుట్',
    
    // Analytics
    sales: 'అమ్మకాలు',
    expenses: 'ఖర్చులు',
    profit: 'లాభం',
    margin: 'మార్జిన్',
    transactions: 'లావాదేవీలు',
    outstanding: 'బాకీలు',
    lowStock: 'తక్కువ స్టాక్',
    dailySales: 'రోజువారీ అమ్మకాలు',
    thisWeek: 'ఈ వారం',
    thisMonth: 'ఈ నెల',
    topTransactionAmounts: 'టాప్ లావాదేవీ మొత్తాలు',
    times: 'సార్లు',
    totalUdhaar: 'మొత్తం అప్పు',
    itemsRunningLow: 'తక్కువైపోతున్న వస్తువులు',
    quickInsights: 'త్వరిత అంతర్దృష్టులు',
    businessProfitable: 'వ్యాపారం లాభదాయకం',
    expensesExceeded: 'ఖర్చులు మించిపోయాయి',
    youHave: 'మీకు ఉంది',
    inPendingPayments: 'పెండింగ్ చెల్లింపులలో',
    itemsNeedRestocking: 'వస్తువులకు రీస్టాకింగ్ అవసరం',
    noTransactionsRecorded: 'ఎటువంటి లావాదేవీలు నమోదు చేయలేదు'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'kn' | 'te'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'hi' | 'kn' | 'te';
    if (savedLanguage && ['en', 'hi', 'kn', 'te'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'hi' | 'kn' | 'te') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
