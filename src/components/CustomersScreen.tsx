
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, User, Phone, AlertCircle, MessageSquare } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const CustomersScreen: React.FC = () => {
  const { customers, addCustomer } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: ''
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name.trim()) {
      addCustomer({
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim() || undefined
      });
      
      toast.success('Customer added successfully!');
      setNewCustomer({ name: '', phone: '' });
      setIsAddDialogOpen(false);
    }
  };

  const sendReminder = (customer: any) => {
    // In a real app, this would send SMS/WhatsApp
    toast.success(`Reminder sent to ${customer.name}!`, {
      description: 'Payment reminder sent via WhatsApp'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const totalOutstanding = customers.reduce((total, customer) => total + customer.totalOutstanding, 0);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-accent to-orange-600 text-white">
        <h3 className="text-sm font-medium mb-2">Udhaar Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs opacity-80">Total Customers</p>
            <p className="text-xl font-bold">{customers.length}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Outstanding Amount</p>
            <p className="text-xl font-bold">{formatCurrency(totalOutstanding)}</p>
          </div>
        </div>
      </Card>

      {/* Add Customer Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mobile-button w-full bg-primary hover:bg-blue-800">
            <Plus className="w-5 h-5 mr-2" />
            Add New Customer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="mobile-button w-full bg-primary hover:bg-blue-800">
              Add Customer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customers List */}
      <div className="space-y-3">
        {customers.length === 0 ? (
          <Card className="p-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No customers added yet</p>
            <p className="text-sm text-gray-500">Add customers to track udhaar transactions</p>
          </Card>
        ) : (
          customers.map((customer) => (
            <Card key={customer.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    {customer.phone && (
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {customer.transactions.length} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {customer.totalOutstanding > 0 ? (
                    <>
                      <p className="font-bold text-accent text-lg">
                        {formatCurrency(customer.totalOutstanding)}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendReminder(customer)}
                        className="mt-1"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Remind
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <span className="text-sm font-medium">All Clear!</span>
                    </div>
                  )}
                </div>
              </div>
              
              {customer.totalOutstanding > 0 && (
                <div className="mt-3 p-2 bg-orange-50 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700">
                    Outstanding payment pending
                  </span>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomersScreen;
