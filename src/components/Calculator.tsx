import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentModeSelector from './PaymentModeSelector';
import { toast } from 'sonner';
import { 
  Calculator as CalculatorIcon,
  Plus, 
  Minus, 
  X, 
  Divide, 
  Equal,
  Delete,
  User,
  Package
} from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [firstValue, setFirstValue] = useState<string | null>(null);
  const [isTransactionMode, setIsTransactionMode] = useState(false);
  
  // Transaction form states
  const [transactionType, setTransactionType] = useState<'cash_in' | 'cash_out'>('cash_in');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'udhaar'>('paid');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'online' | 'udhaar'>('cash');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [note, setNote] = useState('');
  
  const { addTransaction, customers, inventory } = useData();
  const { t } = useLanguage();

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setOperation(null);
    setFirstValue(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (firstValue === null) {
      setFirstValue(display);
    } else if (operation) {
      const currentValue = parseFloat(firstValue);
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setFirstValue(String(newValue));
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (firstValue !== null && operation) {
      const currentValue = parseFloat(firstValue);
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setFirstValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleSaveTransaction = async () => {
    const amount = parseFloat(display);
    
    if (amount <= 0) {
      toast.error(t('pleaseEnterValidAmount'));
      return;
    }

    try {
      await addTransaction({
        amount,
        type: transactionType,
        paymentStatus,
        paymentMode,
        customerId: selectedCustomer || undefined,
        itemId: selectedItem || undefined,
        note: note || undefined
      });

      toast.success(t('transactionSaved'));
      
      // Reset form
      clear();
      setNote('');
      setSelectedCustomer('');
      setSelectedItem('');
      setIsTransactionMode(false);
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(t('failedToSaveTransaction'));
    }
  };

  const toggleTransactionMode = () => {
    setIsTransactionMode(!isTransactionMode);
    if (!isTransactionMode) {
      clear();
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalculatorIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold">{t('calculator')}</h1>
        </div>
        <Button
          variant={isTransactionMode ? "default" : "outline"}
          size="sm"
          onClick={toggleTransactionMode}
        >
          {isTransactionMode ? t('calculator') : t('transaction')}
        </Button>
      </div>

      <Card className="p-4 mb-4">
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="text-right text-2xl font-mono font-bold text-gray-800 min-h-[40px] flex items-center justify-end">
            {display}
          </div>
        </div>

        {isTransactionMode && (
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={transactionType === 'cash_in' ? 'default' : 'outline'}
                onClick={() => setTransactionType('cash_in')}
                size="sm"
              >
                {t('cashIn')}
              </Button>
              <Button
                variant={transactionType === 'cash_out' ? 'default' : 'outline'}
                onClick={() => setTransactionType('cash_out')}
                size="sm"
              >
                {t('cashOut')}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentStatus === 'paid' ? 'default' : 'outline'}
                onClick={() => setPaymentStatus('paid')}
                size="sm"
              >
                {t('paid')}
              </Button>
              <Button
                variant={paymentStatus === 'udhaar' ? 'default' : 'outline'}
                onClick={() => setPaymentStatus('udhaar')}
                size="sm"
              >
                {t('udhaar')}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('paymentMode')}</label>
              <PaymentModeSelector
                value={paymentMode}
                onChange={setPaymentMode}
              />
            </div>

            <div>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <SelectValue placeholder={t('selectCustomer')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <SelectValue placeholder={t('selectItem')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder={t('addNote')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <Button variant="outline" onClick={clear} className="h-12">
            C
          </Button>
          <Button variant="outline" onClick={() => performOperation('/')} className="h-12">
            <Divide className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => performOperation('*')} className="h-12">
            <X className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => {
            setDisplay(display.slice(0, -1) || '0');
          }} className="h-12">
            <Delete className="w-4 h-4" />
          </Button>

          {/* Row 2 */}
          <Button variant="outline" onClick={() => inputNumber('7')} className="h-12">7</Button>
          <Button variant="outline" onClick={() => inputNumber('8')} className="h-12">8</Button>
          <Button variant="outline" onClick={() => inputNumber('9')} className="h-12">9</Button>
          <Button variant="outline" onClick={() => performOperation('-')} className="h-12">
            <Minus className="w-4 h-4" />
          </Button>

          {/* Row 3 */}
          <Button variant="outline" onClick={() => inputNumber('4')} className="h-12">4</Button>
          <Button variant="outline" onClick={() => inputNumber('5')} className="h-12">5</Button>
          <Button variant="outline" onClick={() => inputNumber('6')} className="h-12">6</Button>
          <Button variant="outline" onClick={() => performOperation('+')} className="h-12">
            <Plus className="w-4 h-4" />
          </Button>

          {/* Row 4 */}
          <Button variant="outline" onClick={() => inputNumber('1')} className="h-12">1</Button>
          <Button variant="outline" onClick={() => inputNumber('2')} className="h-12">2</Button>
          <Button variant="outline" onClick={() => inputNumber('3')} className="h-12">3</Button>
          <Button 
            variant="default" 
            onClick={isTransactionMode ? handleSaveTransaction : handleEquals}
            className="h-12 row-span-2 bg-blue-600 hover:bg-blue-700"
          >
            {isTransactionMode ? t('save') : <Equal className="w-4 h-4" />}
          </Button>

          {/* Row 5 */}
          <Button variant="outline" onClick={() => inputNumber('0')} className="h-12 col-span-2">0</Button>
          <Button variant="outline" onClick={inputDecimal} className="h-12">.</Button>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;
