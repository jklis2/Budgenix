import { useState, useEffect } from 'react';
import { updateBudget, BudgetWithItems, updateBudgetItem } from '@/services/budgetService';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budget: BudgetWithItems | null;
}

export function EditBudgetModal({ isOpen, onClose, onSuccess, budget }: EditBudgetModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budgetItems, setBudgetItems] = useState<Array<{
    id: string;
    categoryId: string;
    categoryName: string;
    allocatedAmount: number;
    color: string;
    isEditing: boolean;
  }>>([]);

  // Reset form when modal opens or budget changes
  useEffect(() => {
    if (isOpen && budget) {
      setName(budget.name);
      setBudgetItems(
        budget.budgetItems.map(item => ({
          id: item.id,
          categoryId: item.categoryId,
          categoryName: item.category.name,
          allocatedAmount: item.allocatedAmount,
          color: item.category.color,
          isEditing: false
        }))
      );
      setError(null);
    }
  }, [isOpen, budget]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;
    
    setLoading(true);
    setError(null);

    try {
      // Update budget name
      await updateBudget(budget.id, { name });

      // Update budget items
      for (const item of budgetItems) {
        await updateBudgetItem(budget.id, item.id, {
          allocatedAmount: item.allocatedAmount
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Nie uda\u0142o si\u0119 zaktualizowa\u0107 bud\u017cetu. Spr\u00f3buj ponownie p\u00f3\u017aniej.');
    } finally {
      setLoading(false);
    }
  };

  // Handle budget item allocation change
  const handleAllocationChange = (index: number, value: number) => {
    const newItems = [...budgetItems];
    newItems[index].allocatedAmount = value;
    setBudgetItems(newItems);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // If modal is not open or no budget, don't render anything
  if (!isOpen || !budget) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edytuj bud\u017cet</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nazwa bud\u017cetu</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Kwoty bud\u017cetowe dla kategorii</h3>
            
            <div className="space-y-4">
              {budgetItems.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: item.color || '#6366F1' }}
                      ></div>
                      <span className="font-medium">{item.categoryName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.allocatedAmount}
                      onChange={(e) => handleAllocationChange(index, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-500">{formatCurrency(item.allocatedAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Zapisywanie...
                </span>
              ) : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
