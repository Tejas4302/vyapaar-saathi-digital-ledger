
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  type: 'cash_in' | 'cash_out';
  date: Date;
  note?: string;
  customerId?: string;
  itemId?: string;
  paymentStatus: 'paid' | 'udhaar';
  userId: string; // Added user isolation
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  totalOutstanding: number;
  transactions: Transaction[];
  userId: string; // Added user isolation
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  lowStockThreshold: number;
  userId: string; // Added user isolation
}

interface DataContextType {
  transactions: Transaction[];
  customers: Customer[];
  inventory: InventoryItem[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOutstanding' | 'transactions' | 'userId'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'userId'>) => void;
  updateStock: (itemId: string, quantity: number) => void;
  getTodaysSummary: () => { sales: number; expenses: number; net: number };
  getCustomerById: (id: string) => Customer | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const getCurrentUserId = () => {
    return localStorage.getItem('current_user_id');
  };

  useEffect(() => {
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      // Load user-specific data from localStorage
      const storedTransactions = localStorage.getItem(`vyapaar_transactions_${currentUserId}`);
      const storedCustomers = localStorage.getItem(`vyapaar_customers_${currentUserId}`);
      const storedInventory = localStorage.getItem(`vyapaar_inventory_${currentUserId}`);

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        })));
      } else {
        setTransactions([]);
      }
      
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      } else {
        setCustomers([]);
      }
      
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      } else {
        setInventory([]);
      }
    } else {
      // Clear data if no user logged in
      setTransactions([]);
      setCustomers([]);
      setInventory([]);
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      localStorage.setItem(`${key}_${currentUserId}`, JSON.stringify(data));
    }
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date' | 'userId'>) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      userId: currentUserId
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveToStorage('vyapaar_transactions', updatedTransactions);

    // Update customer outstanding if udhaar
    if (newTransaction.paymentStatus === 'udhaar' && newTransaction.customerId) {
      const updatedCustomers = customers.map(customer => {
        if (customer.id === newTransaction.customerId && customer.userId === currentUserId) {
          return {
            ...customer,
            totalOutstanding: customer.totalOutstanding + newTransaction.amount,
            transactions: [...customer.transactions, newTransaction]
          };
        }
        return customer;
      });
      setCustomers(updatedCustomers);
      saveToStorage('vyapaar_customers', updatedCustomers);
    }
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalOutstanding' | 'transactions' | 'userId'>) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      totalOutstanding: 0,
      transactions: [],
      userId: currentUserId
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveToStorage('vyapaar_customers', updatedCustomers);
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'userId'>) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    const newItem: InventoryItem = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUserId
    };

    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    saveToStorage('vyapaar_inventory', updatedInventory);
  };

  const updateStock = (itemId: string, quantity: number) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    const updatedInventory = inventory.map(item => {
      if (item.id === itemId && item.userId === currentUserId) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock + quantity)
        };
      }
      return item;
    });
    setInventory(updatedInventory);
    saveToStorage('vyapaar_inventory', updatedInventory);
  };

  const getTodaysSummary = () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return { sales: 0, expenses: 0, net: 0 };

    const today = new Date();
    const todaysTransactions = transactions.filter(t => 
      t.date.toDateString() === today.toDateString() && t.userId === currentUserId
    );

    const sales = todaysTransactions
      .filter(t => t.type === 'cash_in')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = todaysTransactions
      .filter(t => t.type === 'cash_out')
      .reduce((sum, t) => sum + t.amount, 0);

    return { sales, expenses, net: sales - expenses };
  };

  const getCustomerById = (id: string) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return undefined;
    
    return customers.find(customer => customer.id === id && customer.userId === currentUserId);
  };

  return (
    <DataContext.Provider value={{
      transactions,
      customers,
      inventory,
      addTransaction,
      addCustomer,
      addInventoryItem,
      updateStock,
      getTodaysSummary,
      getCustomerById
    }}>
      {children}
    </DataContext.Provider>
  );
};
