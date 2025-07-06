
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, User, Phone, AlertCircle, MessageSquare, Edit, Trash2, Users } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const CustomersScreen: React.FC = () => {
  const { customers, addCustomer, deleteCustomer } = useData();
  const { t } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
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
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const resetForm = () => {
    setNewCustomer({ name: '', phone: '' });
  };

  const sendReminder = (customer: any) => {
    // In a real app, this would send SMS/WhatsApp
    toast.success(`Reminder sent to ${customer.name}!`, {
      description: 'Payment reminder sent via WhatsApp'
    });
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      toast.success('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const totalOutstanding = customers.reduce((total, customer) => total + customer.totalOutstanding, 0);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20 bg-gradient-to-br from-slate-50 to-orange-50 min-h-screen">
      {/* Modern Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Customers</h1>
        <p className="text-sm text-gray-600">Manage your customer relationships</p>
      </div>

      {/* Summary Card with modern design */}
      <Card className="p-6 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl rounded-2xl border-0">
        <h3 className="text-sm font-medium mb-4 opacity-90">Customer Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs opacity-80 mb-1">Total Customers</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs opacity-80 mb-1">Outstanding Amount</p>
            <p className="text-xl font-bold">{formatCurrency(totalOutstanding)}</p>
          </div>
        </div>
      </Card>

      {/* Add Customer Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Customer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Add Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Customer Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              Add Customer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customers List */}
      <div className="space-y-4">
        {customers.length === 0 ? (
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-2xl">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2 font-medium">No customers added yet</p>
            <p className="text-sm text-gray-500">Add customers to track credit transactions</p>
          </Card>
        ) : (
          customers.map((customer) => (
            <Card key={customer.id} className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-lg">{customer.name}</p>
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
                      <p className="font-bold text-red-600 text-xl mb-2">
                        {formatCurrency(customer.totalOutstanding)}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendReminder(customer)}
                        className="border-orange-300 hover:bg-orange-50"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Remind
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-xl">
                      <span className="text-sm font-medium">All Clear!</span>
                    </div>
                  )}
                </div>
              </div>
              
              {customer.totalOutstanding > 0 && (
                <div className="mb-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700 font-medium">
                    Outstanding payment pending
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingCustomer(customer)}
                  className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{customer.name}"? This action cannot be undone and will also delete all associated transactions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomersScreen;
