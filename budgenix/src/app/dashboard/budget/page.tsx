"use client";
import { useState, useEffect } from 'react';
import { BudgetSummaryCard } from '@/components/ui/BudgetSummaryCard';
import { BudgetCategoryCard } from '@/components/ui/BudgetCategoryCard';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { TipCard } from '@/components/ui/TipCard';
import { getActiveBudget, getBudgetStats, BudgetStats, BudgetWithItems, getBudgets } from '@/services/budgetService';
import { budgetTip } from '@/constants/budgetData';
import { CreateBudgetModal } from '@/components/modals/CreateBudgetModal';
import { EditBudgetModal } from '@/components/modals/EditBudgetModal';

export default function Budget() {
  // State for budget data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetWithItems | null>(null);
  const [budgetStats, setBudgetStats] = useState<BudgetStats | null>(null);
  
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showBudgetSelector, setShowBudgetSelector] = useState(false);
  const [availableBudgets, setAvailableBudgets] = useState<BudgetWithItems[]>([]);

  // Temporary user ID (in a real app, this would come from authentication)
  // Musimy użyć identyfikatora użytkownika, który faktycznie istnieje w bazie danych
  // W rzeczywistej aplikacji pobralibyśmy to z sesji użytkownika
  const userId = "ebbbb137-6150-409f-85d7-fd79fa505e55"; // Prawidłowe ID użytkownika

  // Fetch budget data
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch active budget
        const activeBudget = await getActiveBudget(userId);
        setBudget(activeBudget);
        
        // Fetch budget stats
        const stats = await getBudgetStats(activeBudget.id);
        const categoryStats = stats.categories;
        
        // Obliczamy sumy dla całego budżetu
        const totalBudget = categoryStats.reduce((sum, cat) => sum + cat.allocated, 0);
        
        // Transakcje są zapisywane jako wartości ujemne (wydatki)
        const rawSpentAmount = categoryStats.reduce((sum, cat) => sum + cat.spent, 0);
        // Zachowujemy ujemną wartość dla spójności z API, ale użyjemy Math.abs przy wyświetlaniu
        const spentAmount = rawSpentAmount;
        
        // Pozostała kwota to różnica między budżetem a rzeczywistymi wydatkami (wartość bezwzględna)
        const remainingAmount = totalBudget - Math.abs(spentAmount);
        
        // Procent wykorzystania budżetu
        const spentPercentage = totalBudget > 0 ? Math.min(Math.round((Math.abs(spentAmount) / totalBudget) * 100), 100) : 0;
        
        setBudgetStats({
          summary: {
            totalBudget,
            spentAmount,
            remainingAmount,
            spentPercentage,
            currentMonth: stats.summary.currentMonth
          },
          categories: categoryStats
        });
        
        // Fetch all available budgets
        const budgets = await getBudgets(userId);
        setAvailableBudgets(budgets);
      } catch (err) {
        console.error('Error fetching budget data:', err);
        setError('Nie udało się pobrać danych budżetu');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [userId]);
  
  // Handle refresh after creating or editing budget
  const handleBudgetChange = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all available budgets
      const budgets = await getBudgets(userId);
      setAvailableBudgets(budgets);
      
      // Refresh active budget
      const activeBudget = await getActiveBudget(userId);
      setBudget(activeBudget);
      
      // Get budget statistics
      const stats = await getBudgetStats(activeBudget.id);
      setBudgetStats(stats);
    } catch (err) {
      console.error('Error refreshing budget data:', err);
      setError('Nie udało się odświeżyć danych budżetu.');
    } finally {
      setLoading(false);
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
  
  // Icons for quick action cards
  const getBudgetActionIcon = (iconType: string) => {
    const icons: Record<string, React.ReactNode> = {
      'adjust': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      'report': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    };
    
    return icons[iconType] || null;
  };
  
  // Tip icon
  const tipIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-600">Ładowanie danych budżetu...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Błąd</p>
        <p>{error}</p>
        <button 
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded transition-colors"
          onClick={() => window.location.reload()}
        >
          Odśwież stronę
        </button>
      </div>
    );
  }

  // If no budget data is available yet
  if (!budgetStats || !budget) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Brak danych budżetu</p>
        <p>Nie znaleziono aktywnego budżetu. Utwórz nowy budżet, aby rozpocząć.</p>
        <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors">
          Utwórz budżet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budżet</h1>
          <p className="text-gray-500 mt-1">Planuj i zarządzaj swoimi wydatkami</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <div className="relative">
            <div 
              className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 flex items-center cursor-pointer hover:bg-gray-50"
              onClick={() => setShowBudgetSelector(!showBudgetSelector)}
            >
              <span className="text-gray-700 font-medium">{budgetStats.summary.currentMonth}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            
            {showBudgetSelector && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {availableBudgets.map((budgetItem) => (
                  <div 
                    key={budgetItem.id} 
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${budget?.id === budgetItem.id ? 'bg-indigo-50 font-medium' : ''}`}
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const stats = await getBudgetStats(budgetItem.id);
                        setBudget(budgetItem);
                        setBudgetStats(stats);
                        setShowBudgetSelector(false);
                      } catch (err) {
                        console.error('Error switching budget:', err);
                        setError('Nie udało się przełączyć budżetu');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {budgetItem.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowy budżet</span>
          </button>
        </div>
      </div>
      
      {/* Budget overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Przegląd budżetu</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <BudgetSummaryCard
            title="Całkowity budżet"
            value={formatCurrency(budgetStats.summary.totalBudget)}
            bgColor="bg-indigo-50"
            textColor="text-indigo-700"
          />
          
          <BudgetSummaryCard
            title="Pozostało"
            value={formatCurrency(budgetStats.summary.totalBudget - Math.abs(budgetStats.summary.spentAmount))}
            bgColor="bg-emerald-50"
            textColor="text-emerald-700"
          />
          
          <BudgetSummaryCard
            title="Wydano"
            value={formatCurrency(Math.abs(budgetStats.summary.spentAmount))}
            bgColor="bg-amber-50"
            textColor="text-amber-700"
          />
        </div>
        
        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">Postęp budżetu</div>
          <div className="text-sm font-medium text-gray-700">{budgetStats.summary.spentPercentage}%</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${budgetStats.summary.spentPercentage > 90 ? 'bg-red-600' : budgetStats.summary.spentPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${budgetStats.summary.spentPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Budget by categories */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Budżet według kategorii</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtruj
          </button>
        </div>
        
        <div className="space-y-6">
          {budgetStats.categories.map((category) => (
            <BudgetCategoryCard
              key={category.id}
              name={category.name}
              spent={category.spent}
              allocated={category.allocated}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      </div>
      
      {/* Budget actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard
          key="edit-budget"
          title="Dostosuj budżet"
          description="Dostosuj swój budżet do zmieniających się potrzeb i celów finansowych"
          icon={getBudgetActionIcon('adjust')}
          buttonText="Edytuj budżet"
          gradientFrom="indigo-600"
          gradientTo="indigo-800"
          textColor="text-indigo-200"
          onClick={() => setIsEditModalOpen(true)}
        />
        <QuickActionCard
          key="budget-report"
          title="Raport budżetu"
          description="Generuj szczegółowy raport z wydatków i oszczędności w tym miesiącu"
          icon={getBudgetActionIcon('report')}
          buttonText="Generuj raport"
          gradientFrom="emerald-600"
          gradientTo="emerald-800"
          textColor="text-emerald-200"
          onClick={() => alert('Funkcja generowania raportu będzie dostępna wkrótce')}
        />
      </div>
      
      {/* Modals */}
      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleBudgetChange}
        userId={userId}
      />
      
      <EditBudgetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleBudgetChange}
        budget={budget}
      />
      
      {/* Budget tips */}
      <TipCard
        title={budgetTip.title}
        content={budgetTip.content}
        icon={tipIcon}
      />
    </div>
  );
}