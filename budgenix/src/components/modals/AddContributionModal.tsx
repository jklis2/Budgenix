import React, { useState, useEffect } from 'react';
import { addContribution, CreateContributionDto } from '@/services/savingsGoalClientService';
import { getAccounts } from '@/services/accountClientService';
import { Account } from '@prisma/client';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  goalId: string;
  userId: string;
}

const AddContributionModal: React.FC<AddContributionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  goalId, 
  userId 
}) => {
  const [formData, setFormData] = useState<Omit<CreateContributionDto, 'userId'>>({    
    amount: 0,
    accountId: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  
  // Fetch user accounts using accountClientService
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setFetchingAccounts(true);
        
        // Pobierz konta użytkownika za pomocą accountClientService
        const accountsData = await getAccounts(userId);
        setAccounts(accountsData);
        
        // Set default account if available
        if (accountsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            accountId: accountsData[0].id
          }));
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Nie udało się pobrać kont. Spróbuj ponownie później.');
      } finally {
        setFetchingAccounts(false);
      }
    };
    
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen, userId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (formData.amount <= 0) {
      setError('Kwota wpłaty musi być większa od zera');
      return;
    }
    
    if (!formData.accountId) {
      setError('Wybierz konto, z którego chcesz dokonać wpłaty');
      return;
    }
    
    // Check if account has sufficient balance
    const selectedAccount = accounts.find(acc => acc.id === formData.accountId);
    if (selectedAccount && selectedAccount.balance < formData.amount) {
      setError(`Niewystarczające środki na koncie ${selectedAccount.name}. Dostępne: ${selectedAccount.balance} PLN`);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await addContribution(goalId, {
        ...formData,
        userId
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      setError('Nie udało się dodać wpłaty. Spróbuj ponownie później.');
      console.error('Error adding contribution:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm" aria-hidden="true" onClick={onClose}>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Dodaj wpłatę do celu oszczędnościowego</h3>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                    {error}
                  </div>
                )}
                
                {fetchingAccounts ? (
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="mt-4 p-4 bg-yellow-50 text-yellow-700 rounded">
                    <p>Nie masz żadnych kont. Dodaj konto, aby móc dokonać wpłaty.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">Wybierz konto</label>
                      <select
                        name="accountId"
                        id="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        {accounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.name} ({account.balance} PLN)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Kwota wpłaty (PLN)</label>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        min="0.01"
                        step="0.01"
                        value={formData.amount || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data wpłaty</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={typeof formData.date === 'string' ? formData.date : formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {accounts.length > 0 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || fetchingAccounts}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Dodawanie...' : 'Dodaj wpłatę'}
              </button>
            )}
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

export default AddContributionModal;
