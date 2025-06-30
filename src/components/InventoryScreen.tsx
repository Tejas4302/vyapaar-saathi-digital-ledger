
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, AlertTriangle, Minus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const InventoryScreen: React.FC = () => {
  const { inventory, addInventoryItem, updateStock } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
      setNewItem({
        name: '',
        category: '',
        unit: 'pieces',
        purchasePrice: '',
        sellingPrice: '',
        currentStock: '',
        lowStockThreshold: '5'
      });
      setIsAddDialogOpen(false);
    }
  };

  const adjustStock = (itemId: string, change: number) => {
    updateStock(itemId, change);
    toast.success(change > 0 ? 'Stock added!' : 'Stock removed!');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.lowStockThreshold);
  const totalValue = inventory.reduce((total, item) => total + (item.currentStock * item.purchasePrice), 0);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-primary to-blue-700 text-white">
        <h3 className="text-sm font-medium mb-3">Inventory Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs opacity-80">Total Items</p>
            <p className="text-lg font-bold">{inventory.length}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Low Stock</p>
            <p className="text-lg font-bold text-orange-200">{lowStockItems.length}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Total Value</p>
            <p className="text-lg font-bold">{formatCurrency(totalValue)}</p>
          </div>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
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
          <Button className="mobile-button w-full bg-primary hover:bg-blue-800">
            <Plus className="w-5 h-5 mr-2" />
            Add New Item
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Item Name *</label>
              <Input
                type="text"
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input
                type="text"
                placeholder="e.g., Groceries, Electronics"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kg</option>
                  <option value="liters">Liters</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Stock</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem({...newItem, currentStock: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.purchasePrice}
                  onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Selling Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.sellingPrice}
                  onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
              <Input
                type="number"
                placeholder="5"
                value={newItem.lowStockThreshold}
                onChange={(e) => setNewItem({...newItem, lowStockThreshold: e.target.value})}
              />
            </div>
            <Button type="submit" className="mobile-button w-full bg-primary hover:bg-blue-800">
              Add Item
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inventory List */}
      <div className="space-y-3">
        {inventory.length === 0 ? (
          <Card className="p-6 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No items in inventory</p>
            <p className="text-sm text-gray-500">Add items to start tracking your stock</p>
          </Card>
        ) : (
          inventory.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.currentStock <= item.lowStockThreshold && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <div className="flex gap-4 text-xs text-gray-400 mt-1">
                    <span>Buy: {formatCurrency(item.purchasePrice)}</span>
                    <span>Sell: {formatCurrency(item.sellingPrice)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    item.currentStock <= item.lowStockThreshold ? 'text-orange-600' : 'text-primary'
                  }`}>
                    {item.currentStock}
                  </p>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustStock(item.id, -1)}
                  className="flex-1"
                  disabled={item.currentStock === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustStock(item.id, 1)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryScreen;
