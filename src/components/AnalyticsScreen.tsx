
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, IndianRupee, Users, Package, Calendar } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, isThisWeek, isThisMonth, startOfWeek, startOfMonth, eachDayOfInterval, endOfWeek, endOfMonth } from 'date-fns';

const AnalyticsScreen: React.FC = () => {
  const { transactions, customers, inventory } = useData();
  const { t } = useLanguage();
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
    
    const salesByAmount = periodTransactions
      .filter(t => t.type === 'cash_in')
      .reduce((acc: Record<string, number>, transaction) => {
        const amount = transaction.amount.toString();
        acc[amount] = (acc[amount] || 0) + 1;
        return acc;
      }, {});
    
    const topSales = Object.entries(salesByAmount)
      .sort(([,a], [,b]) => b - a)
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
    <div className="mobile-container bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Period Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={period === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('week')}
          className={`flex-1 text-proper ${period === 'week' ? 'gradient-primary' : ''}`}
        >
          {t('thisWeek')}
        </Button>
        <Button
          variant={period === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('month')}
          className={`flex-1 text-proper ${period === 'month' ? 'gradient-primary' : ''}`}
        >
          {t('thisMonth')}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="mobile-card gradient-success text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm text-proper">{t('sales')}</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(analytics.sales)}</p>
        </Card>
        
        <Card className="mobile-card gradient-danger text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm text-proper">{t('expenses')}</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(analytics.expenses)}</p>
        </Card>
        
        <Card className="mobile-card gradient-primary text-white">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="w-5 h-5" />
            <span className="text-sm text-proper">{t('profit')}</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(analytics.profit)}</p>
          <p className="text-xs opacity-80">
            {analytics.profitMargin.toFixed(1)}% {t('margin')}
          </p>
        </Card>
        
        <Card className="mobile-card gradient-warning text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm text-proper">{t('transactions')}</span>
          </div>
          <p className="text-xl font-bold">{analytics.transactionCount}</p>
        </Card>
      </div>

      {/* Daily Sales Chart */}
      <Card className="mobile-card">
        <h3 className="font-semibold mb-4 text-proper">{t('dailySales')} ({period === 'week' ? t('thisWeek') : t('thisMonth')})</h3>
        <div className="flex items-end justify-between h-32 gap-1">
          {dailyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className="w-full gradient-primary rounded-t transition-all duration-300"
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
        <Card className="mobile-card">
          <h3 className="font-semibold mb-3 text-proper">{t('topTransactionAmounts')}</h3>
          <div className="space-y-2">
            {analytics.topSales.map(([amount, count], index) => (
              <div key={amount} className="flex items-center justify-between">
                <span className="text-sm text-proper">
                  #{index + 1} {formatCurrency(parseFloat(amount))}
                </span>
                <span className="text-sm text-gray-500 text-proper">{count} {t('times')}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Outstanding & Alerts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="mobile-card">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-proper">{t('outstanding')}</span>
          </div>
          <p className="text-lg font-bold text-accent">
            {formatCurrency(analytics.outstandingAmount)}
          </p>
          <p className="text-xs text-gray-500 text-proper">{t('totalUdhaar')}</p>
        </Card>
        
        <Card className="mobile-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-proper">{t('lowStock')}</span>
          </div>
          <p className="text-lg font-bold text-orange-600">
            {analytics.lowStockItems}
          </p>
          <p className="text-xs text-gray-500 text-proper">{t('itemsRunningLow')}</p>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="mobile-card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <h3 className="font-semibold mb-3 text-proper">{t('quickInsights')}</h3>
        <div className="space-y-2 text-sm">
          {analytics.profit > 0 ? (
            <p className="text-proper">✅ {t('businessProfitable')} {period === 'week' ? t('thisWeek') : t('thisMonth')}!</p>
          ) : (
            <p className="text-proper">⚠️ {t('expensesExceeded')} {period === 'week' ? t('thisWeek') : t('thisMonth')}</p>
          )}
          
          {analytics.outstandingAmount > 0 && (
            <p className="text-proper">💰 {t('youHave')} {formatCurrency(analytics.outstandingAmount)} {t('inPendingPayments')}</p>
          )}
          
          {analytics.lowStockItems > 0 && (
            <p className="text-proper">📦 {analytics.lowStockItems} {t('itemsNeedRestocking')}</p>
          )}
          
          {analytics.transactionCount === 0 && (
            <p className="text-proper">📝 {t('noTransactionsRecorded')} {period === 'week' ? t('thisWeek') : t('thisMonth')}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsScreen;
