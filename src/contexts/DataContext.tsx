
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
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  totalOutstanding: number;
  transactions: Transaction[];
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
}

interface DataContextType {
  transactions: Transaction[];
  customers: Customer[];
  inventory: InventoryItem[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOutstanding' | 'transactions'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
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

  useEffect(() => {
    // Load data from localStorage
    const storedTransactions = localStorage.getItem('vyapaar_transactions');
    const storedCustomers = localStorage.getItem('vyapaar_customers');
    const storedInventory = localStorage.getItem('vyapaar_inventory');

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      })));
    }
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    }
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date()
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveToStorage('vyapaar_transactions', updatedTransactions);

    // Update customer outstanding if udhaar
    if (newTransaction.paymentStatus === 'udhaar' && newTransaction.customerId) {
      const updatedCustomers = customers.map(customer => {
        if (customer.id === newTransaction.customerId) {
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

  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalOutstanding' | 'transactions'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      totalOutstanding: 0,
      transactions: []
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveToStorage('vyapaar_customers', updatedCustomers);
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9)
    };

    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    saveToStorage('vyapaar_inventory', updatedInventory);
  };

  const updateStock = (itemId: string, quantity: number) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
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
    const today = new Date();
    const todaysTransactions = transactions.filter(t => 
      t.date.toDateString() === today.toDateString()
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
    return customers.find(customer => customer.id === id);
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
