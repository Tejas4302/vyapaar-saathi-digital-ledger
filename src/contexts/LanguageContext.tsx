
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // App basics
    appName: 'VyapaarSetu',
    welcome: 'Welcome',
    user: 'User',
    
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
    purchasePricePer: 'Purchase Price per',
    sellingPricePer: 'Selling Price per',
    
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
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'hi';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'hi') => {
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
