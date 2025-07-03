
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  Package,
  Printer,
  Receipt,
  Check,
  ChevronsUpDown
} from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [firstValue, setFirstValue] = useState<string | null>(null);
  const [isTransactionMode, setIsTransactionMode] = useState(true); // Default to transaction mode
  
  // Transaction form states
  const [transactionType, setTransactionType] = useState<'cash_in' | 'cash_out'>('cash_in');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'online' | 'udhaar'>('cash');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [note, setNote] = useState('');
  
  // Dropdown states
  const [customerOpen, setCustomerOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  
  const { addTransaction, customers, inventory } = useData();
  const { t } = useLanguage();

  // Filter customers and items based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredItems = inventory.filter(item =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

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

    // For credit transactions, payment status is always udhaar
    const paymentStatus = paymentMode === 'udhaar' ? 'udhaar' : 'paid';

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
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(t('failedToSaveTransaction'));
    }
  };

  const handlePrintBill = () => {
    const amount = parseFloat(display);
    if (amount <= 0) {
      toast.error(t('pleaseEnterValidAmount'));
      return;
    }

    // Create print data
    const customer = customers.find(c => c.id === selectedCustomer);
    const item = inventory.find(i => i.id === selectedItem);
    
    const printData = {
      amount,
      type: transactionType,
      paymentMode,
      customer: customer?.name || 'Walk-in Customer',
      item: item?.name || '',
      note,
      date: new Date().toLocaleString(),
      transactionId: 'TXN' + Date.now()
    };

    // For now, show a message about printing capability
    // In production, this would connect to USB thermal printer
    toast.success(`${t('print')} - ${printData.transactionId}`);
    console.log('Print Data:', printData);
  };

  const toggleTransactionMode = () => {
    setIsTransactionMode(!isTransactionMode);
    if (!isTransactionMode) {
      clear();
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header with modern design */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <CalculatorIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{t('calculator')}</h1>
            <p className="text-sm text-gray-500">Smart Business Calculator</p>
          </div>
        </div>
        <Button
          variant={isTransactionMode ? "default" : "outline"}
          size="sm"
          onClick={toggleTransactionMode}
          className={`${isTransactionMode 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
            : 'border-gray-300 hover:bg-gray-50'
          } transition-all duration-200`}
        >
          {isTransactionMode ? t('calculator') : t('transaction')}
        </Button>
      </div>

      <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        {/* Display with modern styling */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl mb-6 shadow-inner">
          <div className="text-right text-3xl font-mono font-bold text-green-400 min-h-[50px] flex items-center justify-end">
            ₹{display}
          </div>
        </div>

        {isTransactionMode && (
          <div className="space-y-6 mb-6">
            {/* Transaction Type Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={transactionType === 'cash_in' ? 'default' : 'outline'}
                onClick={() => setTransactionType('cash_in')}
                className={`h-12 ${transactionType === 'cash_in' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                  : 'border-gray-300 hover:bg-green-50'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('cashIn')}
              </Button>
              <Button
                variant={transactionType === 'cash_out' ? 'default' : 'outline'}
                onClick={() => setTransactionType('cash_out')}
                className={`h-12 ${transactionType === 'cash_out' 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                  : 'border-gray-300 hover:bg-red-50'
                }`}
              >
                <Minus className="w-4 h-4 mr-2" />
                {t('cashOut')}
              </Button>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">{t('paymentMode')}</label>
              <PaymentModeSelector
                value={paymentMode}
                onChange={setPaymentMode}
                className="w-full"
              />
            </div>

            {/* Customer Selection with Search */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('selectCustomer')}</label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="w-full justify-between h-12 border-gray-300 hover:border-blue-400"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {selectedCustomer
                          ? customers.find(c => c.id === selectedCustomer)?.name
                          : t('selectCustomer')}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder={`Search ${t('customers').toLowerCase()}...`}
                      value={customerSearch}
                      onValueChange={setCustomerSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCustomers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.id}
                            onSelect={() => {
                              setSelectedCustomer(customer.id);
                              setCustomerOpen(false);
                              setCustomerSearch('');
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedCustomer === customer.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              {customer.phone && (
                                <p className="text-sm text-gray-500">{customer.phone}</p>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Item Selection with Search */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('selectItem')}</label>
              <Popover open={itemOpen} onOpenChange={setItemOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={itemOpen}
                    className="w-full justify-between h-12 border-gray-300 hover:border-blue-400"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {selectedItem
                          ? inventory.find(i => i.id === selectedItem)?.name
                          : t('selectItem')}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder={`Search ${t('inventory').toLowerCase()}...`}
                      value={itemSearch}
                      onValueChange={setItemSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No item found.</CommandEmpty>
                      <CommandGroup>
                        {filteredItems.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={item.id}
                            onSelect={() => {
                              setSelectedItem(item.id);
                              setItemOpen(false);
                              setItemSearch('');
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedItem === item.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('addNote')}</label>
              <Textarea
                placeholder={t('addNote')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>
        )}

        {/* Calculator Buttons with improved design */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button variant="outline" onClick={clear} className="h-14 bg-red-50 border-red-200 hover:bg-red-100 text-red-700 font-semibold">
            C
          </Button>
          <Button variant="outline" onClick={() => performOperation('/')} className="h-14 bg-blue-50 border-blue-200 hover:bg-blue-100">
            <Divide className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => performOperation('*')} className="h-14 bg-blue-50 border-blue-200 hover:bg-blue-100">
            <X className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => {
            setDisplay(display.slice(0, -1) || '0');
          }} className="h-14 bg-orange-50 border-orange-200 hover:bg-orange-100">
            <Delete className="w-5 h-5" />
          </Button>

          {/* Row 2 */}
          <Button variant="outline" onClick={() => inputNumber('7')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">7</Button>
          <Button variant="outline" onClick={() => inputNumber('8')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">8</Button>
          <Button variant="outline" onClick={() => inputNumber('9')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">9</Button>
          <Button variant="outline" onClick={() => performOperation('-')} className="h-14 bg-blue-50 border-blue-200 hover:bg-blue-100">
            <Minus className="w-5 h-5" />
          </Button>

          {/* Row 3 */}
          <Button variant="outline" onClick={() => inputNumber('4')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">4</Button>
          <Button variant="outline" onClick={() => inputNumber('5')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">5</Button>
          <Button variant="outline" onClick={() => inputNumber('6')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">6</Button>
          <Button variant="outline" onClick={() => performOperation('+')} className="h-14 bg-blue-50 border-blue-200 hover:bg-blue-100">
            <Plus className="w-5 h-5" />
          </Button>

          {/* Row 4 */}
          <Button variant="outline" onClick={() => inputNumber('1')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">1</Button>
          <Button variant="outline" onClick={() => inputNumber('2')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">2</Button>
          <Button variant="outline" onClick={() => inputNumber('3')} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">3</Button>
          <Button 
            variant="default" 
            onClick={isTransactionMode ? handleSaveTransaction : handleEquals}
            className="h-14 row-span-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold"
          >
            {isTransactionMode ? t('save') : <Equal className="w-5 h-5" />}
          </Button>

          {/* Row 5 */}
          <Button variant="outline" onClick={() => inputNumber('0')} className="h-14 col-span-2 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">0</Button>
          <Button variant="outline" onClick={inputDecimal} className="h-14 bg-gray-50 hover:bg-gray-100 font-semibold text-lg">.</Button>
        </div>

        {/* Print Button for Transaction Mode */}
        {isTransactionMode && (
          <div className="mt-4">
            <Button
              onClick={handlePrintBill}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold"
            >
              <Printer className="w-5 h-5 mr-2" />
              {t('print')}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Calculator;
