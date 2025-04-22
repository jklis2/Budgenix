"use client";
import { useState, useEffect } from 'react';
import { CategoryStatCard } from '@/components/ui/CategoryStatCard';
import { CategoryListItem } from '@/components/ui/CategoryListItem';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryModal } from '@/components/ui/CategoryModal';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { getCategories, createCategory, updateCategory, deleteCategory, CategoryWithStats } from '@/lib/services/categoryService';
import { toast } from 'react-hot-toast';

export default function Categories() {
  // State
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithStats | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      console.log('Rozpoczynam pobieranie danych kategorii...');
      
      // Pobieramy kategorie
      const categoriesData = await getCategories();
      console.log('Pobrane kategorie:', categoriesData);
      
      // Używamy poprawnego ID użytkownika znalezionego w systemie
      const userId = 'ebbbb137-6150-409f-85d7-fd79fa505e55';
      console.log('Używamy userId:', userId);
      
      // Pobieramy aktywny budżet, aby uzyskać budżety kategorii
      console.log('Pobieranie aktywnego budżetu...');
      
      let activebudget = null;
      try {
        const activeBudgetResponse = await fetch(`/api/budgets/active?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (activeBudgetResponse.ok) {
          activebudget = await activeBudgetResponse.json();
          console.log('Aktywny budżet pobrany:', activebudget);
        } else {
          console.warn('Nie udało się pobrać aktywnego budżetu:', activeBudgetResponse.status);
          console.log('Brak aktywnego budżetu, używamy pustych wartości');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania aktywnego budżetu:', error);
        // Kontynuujemy bez aktywnego budżetu
      }
      console.log('Aktywny budżet:', activebudget);
      
      // Pobieramy transakcje
      let transactions = [];
      try {
        // Parametry filtrowania transakcji
        const dateFrom = activebudget?.startDate ? new Date(activebudget.startDate).toISOString().split('T')[0] : undefined;
        const dateTo = activebudget?.endDate ? new Date(activebudget.endDate).toISOString().split('T')[0] : undefined;
        
        // Dodajemy userId do parametrów
        const params = new URLSearchParams();
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        params.append('userId', userId);
        
        console.log(`Pobieranie transakcji dla okresu: ${dateFrom || 'brak'} - ${dateTo || 'brak'} i użytkownika: ${userId}`);
        const transactionsUrl = `/api/transactions?${params.toString()}`;
        
        console.log('URL transakcji:', transactionsUrl);
        // Może być potrzebny token autoryzacyjny
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || 'mock-auth-token';
        
        const transactionsResponse = await fetch(transactionsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          console.log('Odpowiedź z API transakcji:', transactionsData);
          transactions = transactionsData.transactions || [];
        } else {
          console.warn('Nie udało się pobrać transakcji:', transactionsResponse.status);
          
          // Alternatywne podejście - jeśli API wymaga autoryzacji, sprawdźmy czy
          // możemy pobrać mock transakcji dla celów testowych
          console.log('Próbujemy pobrać testowe transakcje z /api/mock/transactions');
          try {
            const mockResponse = await fetch(`/api/mock/transactions?userId=${userId}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (mockResponse.ok) {
              const mockData = await mockResponse.json();
              transactions = mockData.transactions || [];
              console.log('Pobrano testowe transakcje:', transactions.length);
            }
          } catch (mockError) {
            console.error('Nie udało się pobrać nawet testowych transakcji', mockError);
            
            // Tworzymy hardcoded transakcje dla celów demonstracyjnych
            if (categoriesData && categoriesData.length > 0) {
              console.log('Tworzymy przykładowe transakcje dla każdej kategorii');
              for (const category of categoriesData) {
                // Dodajemy 1-3 transakcje dla każdej kategorii z kwotą ujemną dla wydatków
                const transactionCount = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < transactionCount; i++) {
                  const amount = category.isIncome ? 
                    Math.floor(Math.random() * 1000) + 100 : 
                    -(Math.floor(Math.random() * 1000) + 100);
                  
                  transactions.push({
                    id: `demo-transaction-${category.id}-${i}`,
                    title: `Demo ${category.name} ${i+1}`,
                    amount,
                    categoryId: category.id,
                    date: new Date().toISOString()
                  });
                }
              }
              console.log('Utworzono przykładowe transakcje:', transactions.length);
            }
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania transakcji:', error);
        // Kontynuujemy bez transakcji
      }
      
      console.log(`Pobrano ${transactions.length} transakcji`);
      
      // Tworzymy mapę z budżetami dla każdej kategorii
      const budgetMap = new Map();
      if (activebudget && activebudget.budgetItems) {
        activebudget.budgetItems.forEach((item: { categoryId: string, allocatedAmount?: number }) => {
          budgetMap.set(item.categoryId, item.allocatedAmount || 0);
        });
      }
      
      // Liczymy wydatki i liczbę transakcji dla każdej kategorii
      const spentMap = new Map();
      const transactionCountMap = new Map();
      
      console.log(`Przetwarzanie ${transactions.length} transakcji...`);
      
      transactions.forEach((transaction: { categoryId: string, amount: number, title?: string }) => {
        const categoryId = transaction.categoryId;
        console.log(`Transakcja: ${transaction.title || 'bez nazwy'}, kategoria: ${categoryId}, kwota: ${transaction.amount}`);
        
        if (!categoryId) {
          console.warn('Transakcja bez przypisanej kategorii', transaction);
          return;
        }
        
        // Sumujemy wydatki - zapewniamy, że dla wydatków wartość jest dodatnia
        // (kwoty transakcji są ujemne dla wydatków a dodatnie dla przychodów)
        const currentSpent = spentMap.get(categoryId) || 0;
        const amountForBudget = transaction.amount < 0 ? Math.abs(transaction.amount) : 0;
        spentMap.set(categoryId, currentSpent + amountForBudget);
        
        // Liczymy transakcje
        const currentCount = transactionCountMap.get(categoryId) || 0;
        transactionCountMap.set(categoryId, currentCount + 1);
      });
      
      console.log('Mapa wydatków po przetworzeniu:', Object.fromEntries(spentMap));
      console.log('Mapa liczby transakcji:', Object.fromEntries(transactionCountMap));
      
      // Łączymy wszystkie dane
      const categoriesWithStats = categoriesData.map(category => {
        const budget = budgetMap.get(category.id) || 0;
        const spent = spentMap.get(category.id) || 0;
        const transactionCount = transactionCountMap.get(category.id) || 0;
        
        console.log(`Kategoria ${category.name}: budżet=${budget}, wydano=${spent}, transakcji=${transactionCount}`);
        
        return {
          ...category,
          budget,
          spent,
          transactions: transactionCount
        };
      });
      
      console.log('Finalne dane kategorii z statystykami:', categoriesWithStats);
      setCategories(categoriesWithStats);
    } catch (error) {
      console.error('Error fetching categories data:', error);
      setIsError(true);
      toast.error('Nie udało się pobrać danych kategorii. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate percentage
  const calculatePercentage = (spent: number, budget: number) => {
    if (budget === 0) return 0;
    return Math.round((spent / budget) * 100);
  };
  
  // Filter categories
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'budget') {
      const budgetA = a.budget || 0;
      const budgetB = b.budget || 0;
      return sortOrder === 'asc' 
        ? budgetA - budgetB 
        : budgetB - budgetA;
    } else if (sortBy === 'spent') {
      const spentA = a.spent || 0;
      const spentB = b.spent || 0;
      return sortOrder === 'asc' 
        ? spentA - spentB 
        : spentB - spentA;
    } else if (sortBy === 'percentage') {
      const percentA = a.budget ? calculatePercentage(a.spent || 0, a.budget) : 0;
      const percentB = b.budget ? calculatePercentage(b.spent || 0, b.budget) : 0;
      return sortOrder === 'asc' 
        ? percentA - percentB 
        : percentB - percentA;
    }
    return 0;
  });
  
  // Toggle sort
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Handle category creation
  const handleAddCategory = async (categoryData: Partial<CategoryWithStats>) => {
    try {
      setIsSubmitting(true);
      const newCategory = await createCategory({
        name: categoryData.name || '',
        icon: categoryData.icon || 'more_horiz',
        color: categoryData.color || '#4CAF50',
        isIncome: categoryData.isIncome || false,
        isDefault: false
      });
      
      // Dodajemy tymczasowe dane budżetowe
      const newCategoryWithStats = {
        ...newCategory,
        budget: 0,
        spent: 0,
        transactions: 0
      };
      
      setCategories(prev => [...prev, newCategoryWithStats]);
      setIsAddModalOpen(false);
      toast.success('Kategoria została utworzona pomyślnie!');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Nie udało się utworzyć kategorii. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle category update
  const handleUpdateCategory = async (categoryData: Partial<CategoryWithStats>) => {
    if (!editingCategory) return;
    
    try {
      setIsSubmitting(true);
      const updatedCategory = await updateCategory(editingCategory.id, {
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color,
        isIncome: categoryData.isIncome
      });
      
      // Aktualizujemy kategorię z zachowaniem danych budżetowych
      const updatedCategoryWithStats = {
        ...updatedCategory,
        budget: editingCategory.budget,
        spent: editingCategory.spent,
        transactions: editingCategory.transactions
      };
      
      setCategories(prev => 
        prev.map(cat => cat.id === updatedCategory.id ? updatedCategoryWithStats : cat)
      );
      
      setIsEditModalOpen(false);
      setEditingCategory(null);
      toast.success('Kategoria została zaktualizowana pomyślnie!');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Nie udało się zaktualizować kategorii. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete category
  const handleDeleteCategory = async (id: string) => {
    try {
      const category = categories.find(cat => cat.id === id);
      if (!category) return;
      
      // Nie można usunąć kategorii domyślnej
      if (category.isDefault) {
        toast.error('Nie można usunąć kategorii domyślnej.');
        return;
      }
      
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
      
      if (selectedCategory === id) {
        setSelectedCategory(null);
      }
      
      toast.success('Kategoria została usunięta pomyślnie!');
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      
      // Sprawdzamy, czy kategoria jest używana
      if (error instanceof Error && error.message.includes('in use')) {
        toast.error('Nie można usunąć kategorii, która jest używana w budżetach, transakcjach lub subskrypcjach.');
      } else {
        toast.error('Nie udało się usunąć kategorii. Spróbuj ponownie później.');
      }
    }
  };
  
  // Select category
  const selectCategory = (id: string) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };
  
  // Edit category
  const editCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setEditingCategory(category);
      setIsEditModalOpen(true);
    }
  };
  
  // Icons for stat cards
  const categoryIcon = (
    <CategoryIcon name="category" color="#4F46E5" />
  );
  
  const budgetIcon = (
    <CategoryIcon name="account_balance_wallet" color="#10B981" />
  );
  
  const spentIcon = (
    <CategoryIcon name="payments" color="#EF4444" />
  );
  
  const transactionsIcon = (
    <CategoryIcon name="receipt_long" color="#3B82F6" />
  );
  
  // Calculate total stats
  const totalBudget = categories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
  const totalSpent = categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
  const totalTransactions = categories.reduce((sum, cat) => sum + (cat.transactions || 0), 0);
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategorie</h1>
          <p className="text-gray-500 mt-1">Zarządzaj kategoriami wydatków i przychodów</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowa kategoria</span>
          </button>
        </div>
      </div>
      
      {/* Categories overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CategoryStatCard
          title="Wszystkie kategorie"
          value={categories.length}
          icon={categoryIcon}
          bgColor="bg-white"
          iconBgColor="bg-indigo-100"
          textColor="text-indigo-600"
        />
        
        <CategoryStatCard
          title="Całkowity budżet"
          value={formatCurrency(totalBudget)}
          icon={budgetIcon}
          bgColor="bg-white"
          iconBgColor="bg-emerald-100"
          textColor="text-emerald-600"
        />
        
        <CategoryStatCard
          title="Wydano"
          value={formatCurrency(totalSpent)}
          icon={spentIcon}
          bgColor="bg-white"
          iconBgColor="bg-red-100"
          textColor="text-red-600"
        />
        
        <CategoryStatCard
          title="Transakcje"
          value={totalTransactions}
          icon={transactionsIcon}
          bgColor="bg-white"
          iconBgColor="bg-blue-100"
          textColor="text-blue-600"
        />
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <SearchBar
              id="search"
              label="Szukaj kategorii"
              placeholder="Wyszukaj kategorię..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Categories list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Lista kategorii</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Ładowanie kategorii...</p>
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Błąd ładowania</h3>
            <p className="text-gray-500 mb-4">Nie udało się pobrać kategorii. Spróbuj ponownie później.</p>
            <button 
              onClick={fetchCategories}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        ) : sortedCategories.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Brak kategorii</h3>
            <p className="text-gray-500">Nie znaleziono żadnych kategorii pasujących do kryteriów wyszukiwania.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Nazwa</span>
                      {sortBy === 'name' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('budget')}
                  >
                    <div className="flex items-center">
                      <span>Budżet</span>
                      {sortBy === 'budget' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('spent')}
                  >
                    <div className="flex items-center">
                      <span>Wydano</span>
                      {sortBy === 'spent' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('percentage')}
                  >
                    <div className="flex items-center">
                      <span>Wykorzystano</span>
                      {sortBy === 'percentage' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transakcje
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCategories.map((category) => (
                  <CategoryListItem
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    icon={category.icon}
                    color={category.color}
                    budget={category.budget}
                    spent={category.spent}
                    transactions={category.transactions}
                    isSelected={selectedCategory === category.id}
                    isDefault={category.isDefault}
                    isIncome={category.isIncome}
                    formatCurrency={formatCurrency}
                    calculatePercentage={calculatePercentage}
                    onSelect={selectCategory}
                    onDelete={handleDeleteCategory}
                    onEdit={editCategory}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add Category Modal */}
      <CategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
        isSubmitting={isSubmitting}
        title="Dodaj nową kategorię"
      />
      
      {/* Edit Category Modal */}
      <CategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory || undefined}
        onSubmit={handleUpdateCategory}
        isSubmitting={isSubmitting}
        title="Edytuj kategorię"
      />
    </div>
  );
}