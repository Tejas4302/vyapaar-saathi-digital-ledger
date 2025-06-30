
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Save, RotateCcw } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [transactionType, setTransactionType] = useState<'cash_in' | 'cash_out'>('cash_in');
  
  const { addTransaction, getTodaysSummary } = useData();
  const todaysSummary = getTodaysSummary();

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
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
        return firstValue / secondValue;
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

  const saveTransaction = () => {
    const amount = parseFloat(display);
    if (amount > 0) {
      addTransaction({
        amount,
        type: transactionType,
        paymentStatus: 'paid'
      });
      
      toast.success(
        `₹${amount} saved as ${transactionType === 'cash_in' ? 'Sale' : 'Expense'}!`,
        {
          description: 'Transaction recorded in your ledger',
        }
      );
      
      clear();
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-primary to-blue-700 text-white">
        <h3 className="text-sm font-medium mb-2">Today's Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs opacity-80">Sales</p>
            <p className="font-semibold">{formatCurrency(todaysSummary.sales)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Expenses</p>
            <p className="font-semibold">{formatCurrency(todaysSummary.expenses)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Net</p>
            <p className="font-semibold">{formatCurrency(todaysSummary.net)}</p>
          </div>
        </div>
      </Card>

      {/* Calculator Display */}
      <Card className="p-4">
        <div className="text-right mb-4">
          <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(parseFloat(display))}</div>
          <div className="flex gap-2">
            <Button
              variant={transactionType === 'cash_in' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransactionType('cash_in')}
              className="flex-1"
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              Cash In
            </Button>
            <Button
              variant={transactionType === 'cash_out' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransactionType('cash_out')}
              className="flex-1"
            >
              <ArrowDown className="w-4 h-4 mr-1" />
              Cash Out
            </Button>
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {/* First Row */}
          <Button
            onClick={clear}
            className="calculator-button calculator-action col-span-2"
          >
            <RotateCcw className="w-5 h-5 mr-1" />
            Clear
          </Button>
          <Button
            onClick={() => inputOperation('÷')}
            className="calculator-button calculator-operator"
          >
            ÷
          </Button>
          <Button
            onClick={() => inputOperation('×')}
            className="calculator-button calculator-operator"
          >
            ×
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
            onClick={() => inputOperation('-')}
            className="calculator-button calculator-operator"
          >
            -
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
            onClick={() => inputOperation('+')}
            className="calculator-button calculator-operator"
          >
            +
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
            onClick={performCalculation}
            className="calculator-button calculator-action row-span-2"
          >
            =
          </Button>

          {/* Fifth Row */}
          <Button
            onClick={() => inputNumber('0')}
            className="calculator-button calculator-number col-span-2"
          >
            0
          </Button>
          <Button
            onClick={() => inputNumber('.')}
            className="calculator-button calculator-number"
          >
            .
          </Button>
        </div>

        <Button
          onClick={saveTransaction}
          className="mobile-button w-full mt-4 bg-success hover:bg-green-600"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Transaction
        </Button>
      </Card>
    </div>
  );
};

export default Calculator;
