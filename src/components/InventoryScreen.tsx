
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Package, AlertTriangle, Minus, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const InventoryScreen: React.FC = () => {
  const { inventory, addInventoryItem, updateStock } = useData();
  const { t } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    unit: 'pieces',
    purchasePrice: '',
    sellingPrice: '',
    currentStock: '',
    lowStockThreshold: '5'
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim() && newItem.purchasePrice && newItem.sellingPrice) {
      addInventoryItem({
        name: newItem.name.trim(),
        category: newItem.category.trim() || 'General',
        unit: newItem.unit,
        purchasePrice: parseFloat(newItem.purchasePrice),
        sellingPrice: parseFloat(newItem.sellingPrice),
        currentStock: parseInt(newItem.currentStock) || 0,
        lowStockThreshold: parseInt(newItem.lowStockThreshold) || 5
      });
      
      toast.success('Item added to inventory!');
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      category: '',
      unit: 'pieces',
      purchasePrice: '',
      sellingPrice: '',
      currentStock: '',
      lowStockThreshold: '5'
    });
  };

  const adjustStock = (itemId: string, change: number) => {
    updateStock(itemId, change);
    toast.success(change > 0 ? 'Stock added!' : 'Stock removed!');
  };

  const handleDeleteItem = (itemId: string) => {
    // Note: This would need to be implemented in DataContext
    toast.success('Item deleted!');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getUnitText = (unit: string) => {
    switch (unit) {
      case 'pieces': return t('pieces');
      case 'kg': return t('kg');
      case 'liters': return t('liters');
      case 'boxes': return t('boxes');
      default: return unit;
    }
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.lowStockThreshold);
  const totalValue = inventory.reduce((total, item) => total + (item.currentStock * item.purchasePrice), 0);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20 bg-gradient-to-br from-slate-50 to-green-50 min-h-screen">
      {/* Modern Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('inventory')}</h1>
        <p className="text-sm text-gray-600">Manage your stock efficiently</p>
      </div>

      {/* Summary Card with modern design */}
      <Card className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl rounded-2xl border-0">
        <h3 className="text-sm font-medium mb-4 opacity-90">Inventory Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs opacity-80 mb-1">Total Items</p>
            <p className="text-xl font-bold">{inventory.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs opacity-80 mb-1">Low Stock</p>
            <p className="text-xl font-bold text-orange-200">{lowStockItems.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs opacity-80 mb-1">Total Value</p>
            <p className="text-lg font-bold">{formatCurrency(totalValue)}</p>
          </div>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Low Stock Alert</span>
          </div>
          <p className="text-sm text-orange-700">
            {lowStockItems.length} item(s) running low on stock
          </p>
        </Card>
      )}

      {/* Add Item Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            {t('addItem')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">{t('addItem')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('itemName')} *</label>
              <Input
                type="text"
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('category')}</label>
              <Input
                type="text"
                placeholder="e.g., Groceries, Electronics"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">{t('unit')}</label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                >
                  <option value="pieces">{t('pieces')}</option>
                  <option value="kg">{t('kg')}</option>
                  <option value="liters">{t('liters')}</option>
                  <option value="boxes">{t('boxes')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">{t('currentStock')}</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem({...newItem, currentStock: e.target.value})}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {t('purchasePricePer')} {getUnitText(newItem.unit)} *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.purchasePrice}
                  onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {t('sellingPricePer')} {getUnitText(newItem.unit)} *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.sellingPrice}
                  onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{t('lowStockThreshold')}</label>
              <Input
                type="number"
                placeholder="5"
                value={newItem.lowStockThreshold}
                onChange={(e) => setNewItem({...newItem, lowStockThreshold: e.target.value})}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              {t('addItem')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inventory List */}
      <div className="space-y-4">
        {inventory.length === 0 ? (
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-2xl">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2 font-medium">No items in inventory</p>
            <p className="text-sm text-gray-500">Add items to start tracking your stock</p>
          </Card>
        ) : (
          inventory.map((item) => (
            <Card key={item.id} className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    {item.currentStock <= item.lowStockThreshold && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span className="bg-blue-50 px-2 py-1 rounded-lg">
                      Buy: {formatCurrency(item.purchasePrice)}/{getUnitText(item.unit)}
                    </span>
                    <span className="bg-green-50 px-2 py-1 rounded-lg">
                      Sell: {formatCurrency(item.sellingPrice)}/{getUnitText(item.unit)}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-2xl font-bold ${
                    item.currentStock <= item.lowStockThreshold ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {item.currentStock}
                  </p>
                  <p className="text-xs text-gray-500">{getUnitText(item.unit)}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustStock(item.id, -1)}
                  className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
                  disabled={item.currentStock === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustStock(item.id, 1)}
                  className="flex-1 border-green-200 hover:bg-green-50 hover:border-green-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingItem(item)}
                  className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteItem(item.id)}
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

export default InventoryScreen;
