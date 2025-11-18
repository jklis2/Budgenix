"use client";
import { useState, useEffect, useCallback } from 'react';
import { CategoryStatCard } from '@/components/ui/CategoryStatCard';
import { CategoryListItem } from '@/components/ui/CategoryListItem';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryModal } from '@/components/ui/CategoryModal';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { getCategories, createCategory, updateCategory, deleteCategory, CategoryWithStats } from '@/lib/services/categoryService';
import { getTransactions } from '@/lib/services/transactionService';
import { toast } from 'react-hot-toast';

// Definiujemy interfejsy dla danych z API - wykorzystujemy istniejace typy
import { Transaction as ApiTransaction } from '@/lib/services/transactionService';

interface BudgetItem {
  id: string;
  allocatedAmount: number;
  budgetId: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}

// Interfejs dla budżetu
type Budget = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  isActive: boolean;
  userId: string;
  budgetItems: BudgetItem[];
}

export default function Categories() {
  // State
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [activeBudget, setActiveBudget] = useState<Budget | null>(null);
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
  
  // Pobieramy ID użytkownika z tokenu JWT
  const [userId, setUserId] = useState<string | null>(null);
  
  // Definiujemy fetchCategories jako useCallback, aby zapobiec niepotrzebnym rerenderom
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      if (!userId) {
        console.error('Brak ID użytkownika');
        setIsError(true);
        return;
      }
      
      // Pobieramy kategorie
      const categories = await getCategories();
      
      // Pobieramy aktywny budżet i statystyki
      const activeBudgetResponse = await fetch(`/api/budgets/active?userId=${userId}`);
      const activeBudget = await activeBudgetResponse.json() as Budget;
      
      console.log('Pobrano aktywny budżet:', activeBudget?.name);
      
      // POPRAWKA: Pobieramy transakcje dla BIEŻĄCEGO MIESIĄCA zamiast okresu budżetu dla spójności
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Formatowanie lokalne zamiast UTC
      const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      let transactions: ApiTransaction[] = [];
      try {
        // Używamy gotowego serwisu do pobierania transakcji, który obsługuje autoryzację JWT
        const response = await getTransactions({
          dateFrom: formatLocalDate(firstDay),
          dateTo: formatLocalDate(lastDay),
          limit: 1000 // Pobieramy dużą liczbę transakcji, żeby mieć pełny obraz
        });
        
        transactions = response.transactions;
        console.log('Pobrano transakcje z API:', transactions.length);
        console.log('Przykładowa transakcja:', transactions[0]);
      } catch (error) {
        console.error('Błąd podczas pobierania transakcji:', error);
        toast.error('Nie udało się pobrać transakcji. Spróbuj ponownie później.');
      }
      
      console.log('Pobrane transakcje:', transactions);
      console.log('Aktywny budżet:', activeBudget);
      
      // Obliczamy statystyki dla każdej kategorii
      const categoriesWithStats = categories.map(category => {
        // Znajdź odpowiedni item budżetowy dla tej kategorii
        const budgetItem = activeBudget?.budgetItems?.find((item: BudgetItem) => 
          item.categoryId === category.id || 
          item.category?.id === category.id
        );
        
        if (budgetItem) {
          console.log(`Znaleziono budgetItem dla kategorii ${category.name}: ${budgetItem.allocatedAmount} zł`);
        }
        
        // Znajdź transakcje dla tej kategorii
        const categoryTransactions = transactions.filter(
          (t: ApiTransaction) => t && (t.categoryId === category.id || t.category?.id === category.id)
        );
        
        console.log(`Transakcje dla kategorii ${category.name}:`, categoryTransactions.length);
        
        // Obliczamy sumę faktycznych wydatków - POPRAWKA: filtrujemy po category.isIncome dla spójności
        const expenseTransactions = categoryTransactions.filter(t => 
          t.category?.isIncome === false || (!t.category && t.amount !== undefined)
        );
        
        // Sumujemy wartości bezwzględne transakcji wydatkowych
        const spent = expenseTransactions.reduce((sum: number, t) => {
          // Konwertujemy amount na liczbę, jeśli jest stringiem i używamy wartości bezwzględnej
          const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          return sum + Math.abs(Number(amount));
        }, 0);
        
        console.log(`Kategoria ${category.name} - wydatkowano: ${spent} zł`);
          
        // Kwota z budżetu - zawsze używamy rzeczywistej wartości z API
        const budgetAmount = budgetItem?.allocatedAmount || 0;
        console.log(`Kategoria ${category.name} - budżet: ${budgetAmount} zł`);
        
        // Rzeczywista liczba transakcji
        const transactionCount = categoryTransactions.length;
        
        // Obliczanie procentowego wykorzystania budżetu
        const percentage = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;
        
        return {
          ...category,
          budget: budgetAmount,
          spent: spent,
          transactions: transactionCount,
          percentage: percentage
        };
      });
      
      console.log('Dane kategorii z rzeczywistymi statystykami:', categoriesWithStats.length);
      setCategories(categoriesWithStats);
      setActiveBudget(activeBudget);
    } catch (error) {
      console.error('Error fetching categories data:', error);
      setIsError(true);
      toast.error('Nie udało się pobrać danych kategorii. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  // Pobieranie ID użytkownika przy ładowaniu strony
  useEffect(() => {
    // Dynamiczne importowanie, aby uniknąć problemów z SSR
    import('@/lib/services/authService').then((authService) => {
      const id = authService.getUserId();
      if (id) {
        setUserId(id);
        console.log('Pobrano ID użytkownika z tokenu JWT:', id);
      } else {
        // Jeśli brak tokenu lub ID, można przekierować do strony logowania
        console.error('Brak ID użytkownika w tokenie JWT');
        setIsError(true);
        toast.error('Musisz być zalogowany, aby zobaczyć swoje kategorie');
      }
    });
  }, []);

  // Fetch categories and budget data when userId is available
  useEffect(() => {
    if (!userId) return;
    fetchCategories();
    
    // Ustaw interwał odświeżania danych co 30 sekund, aby zawsze mieć aktualne dane
    const intervalId = setInterval(() => {
      fetchCategories();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [userId, fetchCategories]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return '0,00 zł';
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
    setSelectedCategory(id === selectedCategory ? null : id);
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
          <p className="text-gray-500 mt-1">{activeBudget?.name || 'Budżet bieżący'}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Dodaj kategorię
            </span>
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
                    percentage={category.percentage || 0}
                    isDefault={category.isDefault}
                    isIncome={category.isIncome}
                    transactions={category.transactions}
                    onClick={() => selectCategory(category.id)}
                    onDelete={() => handleDeleteCategory(category.id)}
                    onEdit={() => editCategory(category.id)}
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