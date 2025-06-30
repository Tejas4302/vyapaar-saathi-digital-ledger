
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Calendar } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { format, isThisWeek, isThisMonth, startOfWeek, startOfMonth, eachDayOfInterval, endOfWeek, endOfMonth } from 'date-fns';

const AnalyticsScreen: React.FC = () => {
  const { transactions, customers, inventory } = useData();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getAnalytics = () => {
    const filterFn = period === 'week' ? isThisWeek : isThisMonth;
    const periodTransactions = transactions.filter(t => filterFn(t.date));
    
    const sales = periodTransactions
      .filter(t => t.type === 'cash_in')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = periodTransactions
      .filter(t => t.type === 'cash_out')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const profit = sales - expenses;
    const profitMargin = sales > 0 ? (profit / sales) * 100 : 0;
    
    // Top selling calculation (simplified - based on transaction amounts)
    const salesByAmount = periodTransactions
      .filter(t => t.type === 'cash_in')
      .reduce((acc: any, transaction) => {
        const amount = transaction.amount;
        acc[amount] = (acc[amount] || 0) + 1;
        return acc;
      }, {});
    
    const topSales = Object.entries(salesByAmount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3);
    
    const outstandingAmount = customers.reduce((total, c) => total + c.totalOutstanding, 0);
    const lowStockItems = inventory.filter(item => item.currentStock <= item.lowStockThreshold).length;
    
    return {
      sales,
      expenses,
      profit,
      profitMargin,
      topSales,
      outstandingAmount,
      lowStockItems,
      transactionCount: periodTransactions.length
    };
  };

  const analytics = getAnalytics();

  const getDailyData = () => {
    const start = period === 'week' ? startOfWeek(new Date()) : startOfMonth(new Date());
    const end = period === 'week' ? endOfWeek(new Date()) : endOfMonth(new Date());
    
    return eachDayOfInterval({ start, end }).map(date => {
      const dayTransactions = transactions.filter(t => 
        t.date.toDateString() === date.toDateString()
      );
      
      const sales = dayTransactions
        .filter(t => t.type === 'cash_in')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date,
        sales,
        label: format(date, period === 'week' ? 'EEE' : 'dd')
      };
    });
  };

  const dailyData = getDailyData();
  const maxSales = Math.max(...dailyData.map(d => d.sales), 1);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Period Selector */}
      <div className="flex gap-2">
        <Button
          variant={period === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('week')}
          className="flex-1"
        >
          This Week
        </Button>
        <Button
          variant={period === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('month')}
          className="flex-1"
        >
          This Month
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-gradient-to-r from-success to-green-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Sales</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(analytics.sales)}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm">Expenses</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(analytics.expenses)}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-primary to-blue-700 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Profit</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(analytics.profit)}</p>
          <p className="text-xs opacity-80">
            {analytics.profitMargin.toFixed(1)}% margin
          </p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-accent to-orange-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Transactions</span>
          </div>
          <p className="text-xl font-bold">{analytics.transactionCount}</p>
        </Card>
      </div>

      {/* Daily Sales Chart */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Daily Sales ({period === 'week' ? 'This Week' : 'This Month'})</h3>
        <div className="flex items-end justify-between h-32 gap-1">
          {dailyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className="w-full bg-primary rounded-t transition-all duration-300"
                  style={{
                    height: `${(day.sales / maxSales) * 100}%`,
                    minHeight: day.sales > 0 ? '4px' : '0px'
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{day.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Sales */}
      {analytics.topSales.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Top Transaction Amounts</h3>
          <div className="space-y-2">
            {analytics.topSales.map(([amount, count], index) => (
              <div key={amount} className="flex items-center justify-between">
                <span className="text-sm">
                  #{index + 1} {formatCurrency(parseFloat(amount))}
                </span>
                <span className="text-sm text-gray-500">{count} times</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Outstanding & Alerts */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">Outstanding</span>
          </div>
          <p className="text-lg font-bold text-accent">
            {formatCurrency(analytics.outstandingAmount)}
          </p>
          <p className="text-xs text-gray-500">Total udhaar</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium">Low Stock</span>
          </div>
          <p className="text-lg font-bold text-orange-600">
            {analytics.lowStockItems}
          </p>
          <p className="text-xs text-gray-500">Items running low</p>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <h3 className="font-semibold mb-3">Quick Insights</h3>
        <div className="space-y-2 text-sm">
          {analytics.profit > 0 ? (
            <p>✅ Your business is profitable this {period}!</p>
          ) : (
            <p>⚠️ Expenses exceeded sales this {period}</p>
          )}
          
          {analytics.outstandingAmount > 0 && (
            <p>💰 You have {formatCurrency(analytics.outstandingAmount)} in pending payments</p>
          )}
          
          {analytics.lowStockItems > 0 && (
            <p>📦 {analytics.lowStockItems} items need restocking</p>
          )}
          
          {analytics.transactionCount === 0 && (
            <p>📝 No transactions recorded this {period}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsScreen;
