
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Filter, Download, Calendar } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

const LedgerScreen: React.FC = () => {
  const { transactions } = useData();
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const filteredTransactions = transactions.filter(transaction => {
    switch (filter) {
      case 'today':
        return isToday(transaction.date);
      case 'week':
        return isThisWeek(transaction.date);
      case 'month':
        return isThisMonth(transaction.date);
      default:
        return true;
    }
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const summary = filteredTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'cash_in') {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const exportLedger = () => {
    // In a real app, this would generate a PDF or share via WhatsApp
    const data = filteredTransactions.map(t => 
      `${format(t.date, 'dd/MM/yyyy HH:mm')} | ${t.type === 'cash_in' ? 'IN' : 'OUT'} | ${formatCurrency(t.amount)} | ${t.paymentStatus.toUpperCase()}`
    ).join('\n');
    
    console.log('Ledger Export:', data);
    alert('Export feature would share via WhatsApp in the mobile app');
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-success to-green-600 text-white">
        <h3 className="text-sm font-medium mb-3">Cash Flow Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs opacity-80">Income</p>
            <p className="text-lg font-bold">{formatCurrency(summary.income)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Expense</p>
            <p className="text-lg font-bold">{formatCurrency(summary.expense)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Net</p>
            <p className="text-lg font-bold">{formatCurrency(summary.income - summary.expense)}</p>
          </div>
        </div>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'today', label: 'Today' },
          { key: 'week', label: 'This Week' },
          { key: 'month', label: 'This Month' },
          { key: 'all', label: 'All Time' }
        ].map((filterOption) => (
          <Button
            key={filterOption.key}
            variant={filter === filterOption.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterOption.key as any)}
            className="whitespace-nowrap"
          >
            {filterOption.label}
          </Button>
        ))}
      </div>

      {/* Export Button */}
      <Button
        onClick={exportLedger}
        variant="outline"
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Ledger
      </Button>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="p-6 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No transactions found for this period</p>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'cash_in' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'cash_in' ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {transaction.type === 'cash_in' ? 'Sale' : 'Expense'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(transaction.date, 'dd MMM, HH:mm')}
                    </p>
                    {transaction.note && (
                      <p className="text-xs text-gray-400">{transaction.note}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'cash_in' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'cash_in' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {transaction.paymentStatus === 'paid' ? 'Paid' : 'Udhaar'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default LedgerScreen;
