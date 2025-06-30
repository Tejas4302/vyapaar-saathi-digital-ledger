
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Save } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [transactionType, setTransactionType] = useState<'cash_in' | 'cash_out'>('cash_in');
  
  const { addTransaction, getTodaysSummary } = useData();
  const { t } = useLanguage();
  const todaysSummary = getTodaysSummary();

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : firstValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const saveTransaction = () => {
    const amount = parseFloat(display);
    if (amount > 0) {
      addTransaction({
        amount,
        type: transactionType,
        paymentStatus: 'paid'
      });
      
      toast.success(t('transactionSaved'));
      clear();
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDisplay = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '₹0';
    return formatCurrency(num);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-primary to-blue-700 text-white">
        <h3 className="text-sm font-medium mb-2">{t('todaysSummary')}</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs opacity-80">{t('sales')}</p>
            <p className="font-semibold">{formatCurrency(todaysSummary.sales)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">{t('expenses')}</p>
            <p className="font-semibold">{formatCurrency(todaysSummary.expenses)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">{t('net')}</p>
            <p className="font-semibold">{formatCurrency(todaysSummary.net)}</p>
          </div>
        </div>
      </Card>

      {/* Calculator Display */}
      <Card className="p-4">
        <div className="text-right mb-4">
          <div className="text-3xl font-bold text-primary mb-2 min-h-[1.2em] bg-gray-50 p-3 rounded border">
            {formatDisplay(display)}
          </div>
          <div className="flex gap-2">
            <Button
              variant={transactionType === 'cash_in' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransactionType('cash_in')}
              className="flex-1"
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              {t('cashIn')}
            </Button>
            <Button
              variant={transactionType === 'cash_out' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransactionType('cash_out')}
              className="flex-1"
            >
              <ArrowDown className="w-4 h-4 mr-1" />
              {t('cashOut')}
            </Button>
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* First Row */}
          <Button
            onClick={clear}
            className="calculator-button calculator-action text-sm"
          >
            AC
          </Button>
          <Button
            onClick={clearEntry}
            className="calculator-button calculator-action text-sm"
          >
            CE
          </Button>
          <Button
            onClick={backspace}
            className="calculator-button calculator-action text-sm"
          >
            ⌫
          </Button>
          <Button
            onClick={() => inputOperation('÷')}
            className="calculator-button calculator-operator"
          >
            ÷
          </Button>

          {/* Second Row */}
          <Button
            onClick={() => inputNumber('7')}
            className="calculator-button calculator-number"
          >
            7
          </Button>
          <Button
            onClick={() => inputNumber('8')}
            className="calculator-button calculator-number"
          >
            8
          </Button>
          <Button
            onClick={() => inputNumber('9')}
            className="calculator-button calculator-number"
          >
            9
          </Button>
          <Button
            onClick={() => inputOperation('×')}
            className="calculator-button calculator-operator"
          >
            ×
          </Button>

          {/* Third Row */}
          <Button
            onClick={() => inputNumber('4')}
            className="calculator-button calculator-number"
          >
            4
          </Button>
          <Button
            onClick={() => inputNumber('5')}
            className="calculator-button calculator-number"
          >
            5
          </Button>
          <Button
            onClick={() => inputNumber('6')}
            className="calculator-button calculator-number"
          >
            6
          </Button>
          <Button
            onClick={() => inputOperation('-')}
            className="calculator-button calculator-operator"
          >
            -
          </Button>

          {/* Fourth Row */}
          <Button
            onClick={() => inputNumber('1')}
            className="calculator-button calculator-number"
          >
            1
          </Button>
          <Button
            onClick={() => inputNumber('2')}
            className="calculator-button calculator-number"
          >
            2
          </Button>
          <Button
            onClick={() => inputNumber('3')}
            className="calculator-button calculator-number"
          >
            3
          </Button>
          <Button
            onClick={() => inputOperation('+')}
            className="calculator-button calculator-operator row-span-2"
          >
            +
          </Button>

          {/* Fifth Row */}
          <Button
            onClick={() => inputNumber('0')}
            className="calculator-button calculator-number col-span-2"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            className="calculator-button calculator-number"
          >
            .
          </Button>
          
          {/* Sixth Row - Equals */}
          <Button
            onClick={performCalculation}
            className="calculator-button calculator-action col-span-2"
          >
            =
          </Button>
        </div>

        <Button
          onClick={saveTransaction}
          className="mobile-button w-full mt-4 bg-success hover:bg-green-600"
        >
          <Save className="w-5 h-5 mr-2" />
          {t('saveTransaction')}
        </Button>
      </Card>
    </div>
  );
};

export default Calculator;
