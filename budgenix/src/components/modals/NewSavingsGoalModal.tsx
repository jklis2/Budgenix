import React, { useState } from 'react';
import { createSavingsGoal, CreateSavingsGoalDto } from '@/services/savingsGoalClientService';

interface NewSavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const NewSavingsGoalModal: React.FC<NewSavingsGoalModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
  const [formData, setFormData] = useState<Omit<CreateSavingsGoalDto, 'userId'>>({    
    name: '',
    targetAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
    icon: '💰',
    color: 'indigo'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetAmount' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Nazwa celu jest wymagana');
      return;
    }
    
    if (formData.targetAmount <= 0) {
      setError('Kwota celu musi być większa od zera');
      return;
    }
    
    const startDate = new Date(formData.startDate);
    const targetDate = new Date(formData.targetDate);
    
    if (targetDate <= startDate) {
      setError('Data docelowa musi być późniejsza niż data początkowa');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createSavingsGoal({
        ...formData,
        userId
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      setError('Nie udało się utworzyć celu. Spróbuj ponownie później.');
      console.error('Error creating savings goal:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Nowy cel oszczędnościowy</h3>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nazwa celu</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Kwota docelowa (PLN)</label>
                    <input
                      type="number"
                      name="targetAmount"
                      id="targetAmount"
                      min="1"
                      step="0.01"
                      value={formData.targetAmount || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data początkowa</label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={typeof formData.startDate === 'string' ? formData.startDate : formData.startDate.toISOString().split('T')[0]}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">Data docelowa</label>
                      <input
                        type="date"
                        name="targetDate"
                        id="targetDate"
                        value={typeof formData.targetDate === 'string' ? formData.targetDate : formData.targetDate.toISOString().split('T')[0]}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Ikona</label>
                      <select
                        name="icon"
                        id="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="💰">💰 Pieniądze</option>
                        <option value="🏠">🏠 Dom</option>
                        <option value="🚗">🚗 Samochód</option>
                        <option value="✈️">✈️ Podróż</option>
                        <option value="💻">💻 Elektronika</option>
                        <option value="📚">📚 Edukacja</option>
                        <option value="👶">👶 Dziecko</option>
                        <option value="🛡️">🛡️ Fundusz awaryjny</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="color" className="block text-sm font-medium text-gray-700">Kolor</label>
                      <select
                        name="color"
                        id="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="indigo">Indigo</option>
                        <option value="blue">Niebieski</option>
                        <option value="red">Czerwony</option>
                        <option value="green">Zielony</option>
                        <option value="yellow">Żółty</option>
                        <option value="purple">Fioletowy</option>
                        <option value="pink">Różowy</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Tworzenie...' : 'Utwórz cel'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSavingsGoalModal;
