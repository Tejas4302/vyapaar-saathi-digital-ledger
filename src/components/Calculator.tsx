
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
  Delete,
  User,
  Package,
  Printer,
  Check,
  ChevronsUpDown,
  Save
} from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [firstValue, setFirstValue] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<number | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<string>('');
  
  // Transaction form states
  const [transactionType, setTransactionType] = useState<'cash_in' | 'cash_out'>('cash_in');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'online' | 'udhaar'>('cash');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  
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
    setCalculationResult(null);
    setCalculationHistory('');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (firstValue === null) {
      setFirstValue(display);
      setCalculationHistory(display + ' ' + nextOperation + ' ');
    } else if (operation) {
      const currentValue = parseFloat(firstValue);
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setFirstValue(String(newValue));
      setCalculationHistory(calculationHistory + display + ' ' + nextOperation + ' ');
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
    if (operation && firstValue) {
      const inputValue = parseFloat(display);
      const currentValue = parseFloat(firstValue);
      const result = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(result));
      setCalculationResult(result);
      setCalculationHistory(calculationHistory + display + ' = ' + result);
      setOperation(null);
      setFirstValue(null);
      setWaitingForNewValue(true);
    }
  };

  const handleCheckTransaction = () => {
    const amount = calculationResult || parseFloat(display);
    
    if (amount <= 0) {
      toast.error(t('pleaseEnterValidAmount'));
      return;
    }

    // Get selected customer and item details
    const customer = customers.find(c => c.id === selectedCustomer);
    const item = inventory.find(i => i.id === selectedItem);
    
    // Create comprehensive transaction summary
    const transactionSummary = {
      'Transaction Type': transactionType === 'cash_in' ? 'Cash In' : 'Cash Out',
      'Amount': `₹${amount}`,
      'Payment Mode': paymentMode.charAt(0).toUpperCase() + paymentMode.slice(1),
      'Customer': customer?.name || 'No customer selected',
      'Item': item?.name || 'No item selected',
      'Calculation': calculationHistory || display
    };

    // Show detailed transaction review
    let reviewMessage = 'Transaction Review:\n\n';
    Object.entries(transactionSummary).forEach(([key, value]) => {
      reviewMessage += `${key}: ${value}\n`;
    });

    // Validation checks
    const validationMessages = [];
    
    if (transactionType === 'cash_in' && !selectedCustomer && paymentMode === 'udhaar') {
      validationMessages.push('⚠️ Customer required for credit transactions');
    }
    
    if (amount > 100000) {
      validationMessages.push('⚠️ Large transaction amount detected');
    }

    if (validationMessages.length > 0) {
      reviewMessage += '\nValidation Warnings:\n' + validationMessages.join('\n');
      toast.warning('Please review transaction details');
    } else {
      toast.success('Transaction details verified ✓');
    }

    // Log detailed review for user to see
    console.log('=== TRANSACTION REVIEW ===');
    console.log(reviewMessage);
    console.log('========================');

    // Show review in a more user-friendly way
    toast.info('Transaction review logged to console');
  };

  const handleSaveTransaction = async () => {
    const amount = calculationResult || parseFloat(display);
    
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
        note: undefined
      });

      toast.success(t('transactionSaved'));
      
      // Reset form
      clear();
      setSelectedCustomer('');
      setSelectedItem('');
      setCalculationResult(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(t('failedToSaveTransaction'));
    }
  };

  const handlePrintBill = () => {
    const amount = calculationResult || parseFloat(display);
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
      date: new Date().toLocaleString(),
      transactionId: 'TXN' + Date.now(),
      calculation: calculationHistory || display
    };

    // For now, show a message about printing capability
    // In production, this would connect to USB thermal printer
    toast.success(`${t('print')} - ${printData.transactionId}`);
    console.log('Print Data:', printData);
  };

  return (
    <div className="mobile-container bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with modern design */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <CalculatorIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="title-text">{t('transaction')}</h1>
            <p className="subtitle-text">Smart Business Calculator</p>
          </div>
        </div>
      </div>

      <Card className="mobile-card bg-white/80 backdrop-blur-sm shadow-xl">
        {/* Display with calculation history */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl mb-6 shadow-inner">
          {/* Calculation History */}
          {calculationHistory && (
            <div className="text-right text-sm font-mono text-gray-400 mb-2 min-h-[20px] break-all">
              {calculationHistory}
            </div>
          )}
          
          {/* Current Display */}
          <div className="text-right text-3xl font-mono font-bold text-green-400 min-h-[50px] flex items-center justify-end break-all">
            ₹{display}
          </div>
          
          {/* Result Display */}
          {calculationResult && (
            <div className="text-right text-sm text-blue-400 mt-2">
              Final Amount: ₹{calculationResult}
            </div>
          )}
        </div>

        <div className="space-y-6 mb-6">
          {/* Transaction Type Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={transactionType === 'cash_in' ? 'default' : 'outline'}
              onClick={() => setTransactionType('cash_in')}
              className={`mobile-button ${transactionType === 'cash_in' 
                ? 'gradient-success hover:from-green-600 hover:to-emerald-600' 
                : 'border-gray-300 hover:bg-green-50'
              } text-proper`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('cashIn')}
            </Button>
            <Button
              variant={transactionType === 'cash_out' ? 'default' : 'outline'}
              onClick={() => setTransactionType('cash_out')}
              className={`mobile-button ${transactionType === 'cash_out' 
                ? 'gradient-danger hover:from-red-600 hover:to-pink-600' 
                : 'border-gray-300 hover:bg-red-50'
              } text-proper`}
            >
              <Minus className="w-4 h-4 mr-2" />
              {t('cashOut')}
            </Button>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="label-text block">{t('paymentMode')}</label>
            <PaymentModeSelector
              value={paymentMode}
              onChange={setPaymentMode}
              className="w-full"
            />
          </div>

          {/* Customer and Item Selection on same row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Customer Selection */}
            <div>
              <label className="label-text block">{t('selectCustomer')}</label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="mobile-input justify-between border-gray-300 hover:border-blue-400 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 text-proper text-xs truncate">
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
                              <p className="font-medium text-proper">{customer.name}</p>
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

            {/* Item Selection */}
            <div>
              <label className="label-text block">{t('selectItem')}</label>
              <Popover open={itemOpen} onOpenChange={setItemOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={itemOpen}
                    className="mobile-input justify-between border-gray-300 hover:border-blue-400 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 text-proper text-xs truncate">
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
                              <p className="font-medium text-proper">{item.name}</p>
                              <p className="text-sm text-gray-500 text-proper">{item.category}</p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Calculator Buttons with improved design */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button variant="outline" onClick={clear} className="calculator-button bg-red-50 border-red-200 hover:bg-red-100 text-red-700 font-semibold">
            C
          </Button>
          <Button variant="outline" onClick={() => performOperation('/')} className="calculator-button calculator-operator">
            <Divide className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => performOperation('*')} className="calculator-button calculator-operator">
            <X className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => {
            setDisplay(display.slice(0, -1) || '0');
          }} className="calculator-button bg-orange-50 border-orange-200 hover:bg-orange-100">
            <Delete className="w-5 h-5" />
          </Button>

          {/* Row 2 */}
          <Button variant="outline" onClick={() => inputNumber('7')} className="calculator-button calculator-number">7</Button>
          <Button variant="outline" onClick={() => inputNumber('8')} className="calculator-button calculator-number">8</Button>
          <Button variant="outline" onClick={() => inputNumber('9')} className="calculator-button calculator-number">9</Button>
          <Button variant="outline" onClick={() => performOperation('-')} className="calculator-button calculator-operator">
            <Minus className="w-5 h-5" />
          </Button>

          {/* Row 3 */}
          <Button variant="outline" onClick={() => inputNumber('4')} className="calculator-button calculator-number">4</Button>
          <Button variant="outline" onClick={() => inputNumber('5')} className="calculator-button calculator-number">5</Button>
          <Button variant="outline" onClick={() => inputNumber('6')} className="calculator-button calculator-number">6</Button>
          <Button variant="outline" onClick={() => performOperation('+')} className="calculator-button calculator-operator">
            <Plus className="w-5 h-5" />
          </Button>

          {/* Row 4 */}
          <Button variant="outline" onClick={() => inputNumber('1')} className="calculator-button calculator-number">1</Button>
          <Button variant="outline" onClick={() => inputNumber('2')} className="calculator-button calculator-number">2</Button>
          <Button variant="outline" onClick={() => inputNumber('3')} className="calculator-button calculator-number">3</Button>
          <Button variant="outline" onClick={() => inputNumber('0')} className="calculator-button calculator-number">0</Button>

          {/* Row 5 */}
          <Button variant="outline" onClick={inputDecimal} className="calculator-button calculator-number">.</Button>
          <Button 
            variant="default" 
            onClick={handleEquals}
            className="calculator-button calculator-equals font-semibold"
          >
            =
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCheckTransaction}
            className="calculator-button bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button 
            variant="default" 
            onClick={handleSaveTransaction}
            className="calculator-button gradient-success hover:from-green-700 hover:to-emerald-700 font-semibold"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>

        {/* Print Button */}
        <div className="mt-4">
          <Button
            onClick={handlePrintBill}
            className="mobile-button gradient-success hover:from-green-700 hover:to-emerald-700 font-semibold text-proper"
          >
            <Printer className="w-5 h-5 mr-2" />
            {t('print')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;
