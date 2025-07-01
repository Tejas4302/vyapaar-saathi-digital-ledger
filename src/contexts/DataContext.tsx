
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Transaction {
  id: string;
  amount: number;
  type: 'cash_in' | 'cash_out';
  date: Date;
  note?: string;
  customerId?: string;
  itemId?: string;
  paymentStatus: 'paid' | 'udhaar';
  paymentMode: 'cash' | 'online' | 'udhaar';
  userId: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  totalOutstanding: number;
  transactions: Transaction[];
  userId: string;
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
  userId: string;
}

interface DataContextType {
  transactions: Transaction[];
  customers: Customer[];
  inventory: InventoryItem[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOutstanding' | 'transactions' | 'userId'>) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'userId'>) => Promise<void>;
  updateStock: (itemId: string, quantity: number) => Promise<void>;
  getTodaysSummary: () => { sales: number; expenses: number; net: number };
  getCustomerById: (id: string) => Customer | undefined;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setCustomers([]);
      setInventory([]);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadTransactions(),
        loadCustomers(),
        loadInventory()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      const formattedTransactions: Transaction[] = data.map(t => ({
        id: t.id,
        amount: parseFloat(t.amount),
        type: t.type as 'cash_in' | 'cash_out',
        date: new Date(t.date),
        note: t.note,
        customerId: t.customer_id,
        itemId: t.item_id,
        paymentStatus: t.payment_status as 'paid' | 'udhaar',
        paymentMode: t.payment_mode as 'cash' | 'online' | 'udhaar',
        userId: t.user_id
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadCustomers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading customers:', error);
        return;
      }

      const formattedCustomers: Customer[] = data.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        totalOutstanding: parseFloat(c.total_outstanding || '0'),
        transactions: transactions.filter(t => t.customerId === c.id),
        userId: c.user_id
      }));

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadInventory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading inventory:', error);
        return;
      }

      const formattedInventory: InventoryItem[] = data.map(i => ({
        id: i.id,
        name: i.name,
        category: i.category,
        unit: i.unit,
        purchasePrice: parseFloat(i.purchase_price),
        sellingPrice: parseFloat(i.selling_price),
        currentStock: i.current_stock,
        lowStockThreshold: i.low_stock_threshold,
        userId: i.user_id
      }));

      setInventory(formattedInventory);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'date' | 'userId'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: transactionData.amount,
          type: transactionData.type,
          note: transactionData.note,
          customer_id: transactionData.customerId,
          item_id: transactionData.itemId,
          payment_status: transactionData.paymentStatus,
          payment_mode: transactionData.paymentMode
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        throw error;
      }

      const newTransaction: Transaction = {
        id: data.id,
        amount: parseFloat(data.amount),
        type: data.type,
        date: new Date(data.date),
        note: data.note,
        customerId: data.customer_id,
        itemId: data.item_id,
        paymentStatus: data.payment_status,
        paymentMode: data.payment_mode,
        userId: data.user_id
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Update customer outstanding if udhaar
      if (transactionData.paymentStatus === 'udhaar' && transactionData.customerId) {
        await updateCustomerOutstanding(transactionData.customerId, transactionData.amount);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateCustomerOutstanding = async (customerId: string, amount: number) => {
    try {
      // Get current outstanding
      const { data: customer, error: fetchError } = await supabase
        .from('customers')
        .select('total_outstanding')
        .eq('id', customerId)
        .single();

      if (fetchError) {
        console.error('Error fetching customer:', fetchError);
        return;
      }

      const newOutstanding = parseFloat(customer.total_outstanding || '0') + amount;

      const { error: updateError } = await supabase
        .from('customers')
        .update({ total_outstanding: newOutstanding })
        .eq('id', customerId);

      if (updateError) {
        console.error('Error updating customer outstanding:', updateError);
        return;
      }

      // Update local state
      setCustomers(prev => prev.map(c => 
        c.id === customerId 
          ? { ...c, totalOutstanding: newOutstanding }
          : c
      ));
    } catch (error) {
      console.error('Error updating customer outstanding:', error);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'totalOutstanding' | 'transactions' | 'userId'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          user_id: user.id,
          name: customerData.name,
          phone: customerData.phone
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        throw error;
      }

      const newCustomer: Customer = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        totalOutstanding: 0,
        transactions: [],
        userId: data.user_id
      };

      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'userId'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          user_id: user.id,
          name: itemData.name,
          category: itemData.category,
          unit: itemData.unit,
          purchase_price: itemData.purchasePrice,
          selling_price: itemData.sellingPrice,
          current_stock: itemData.currentStock,
          low_stock_threshold: itemData.lowStockThreshold
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding inventory item:', error);
        throw error;
      }

      const newItem: InventoryItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        unit: data.unit,
        purchasePrice: parseFloat(data.purchase_price),
        sellingPrice: parseFloat(data.selling_price),
        currentStock: data.current_stock,
        lowStockThreshold: data.low_stock_threshold,
        userId: data.user_id
      };

      setInventory(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  };

  const updateStock = async (itemId: string, quantity: number) => {
    if (!user) return;

    try {
      // Get current stock
      const { data: item, error: fetchError } = await supabase
        .from('inventory_items')
        .select('current_stock')
        .eq('id', itemId)
        .single();

      if (fetchError) {
        console.error('Error fetching item:', fetchError);
        return;
      }

      const newStock = Math.max(0, item.current_stock + quantity);

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ current_stock: newStock })
        .eq('id', itemId);

      if (updateError) {
        console.error('Error updating stock:', updateError);
        return;
      }

      // Update local state
      setInventory(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, currentStock: newStock }
          : i
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const getTodaysSummary = () => {
    if (!user) return { sales: 0, expenses: 0, net: 0 };

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
      getCustomerById,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};
