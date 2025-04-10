"use client";
import { useState, useEffect, useCallback } from 'react';
import {
  getSavingsGoals,
  getSavingsGoalStats,
  deleteSavingsGoal,
  formatCurrency, 
  formatDate, 
  getDaysUntil, 
  calculateProgress, 
  calculateMonthlyContribution,
  SavingsGoalWithContributions,
  SavingsGoalStats
} from '@/services/savingsGoalClientService';
import SavingsProgressCard from '@/components/ui/SavingsProgressCard';
import SavingsGoalCard from '@/components/ui/SavingsGoalCard';
import EmptyStateCard from '@/components/ui/EmptyStateCard';
import NewSavingsGoalModal from '@/components/modals/NewSavingsGoalModal';
import AddContributionModal from '@/components/modals/AddContributionModal';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'ebbbb137-6150-409f-85d7-fd79fa505e55';

export default function SavingsGoals() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoalWithContributions[]>([]);
  const [stats, setStats] = useState<SavingsGoalStats>({
    totalSaved: 0,
    totalTarget: 0,
    progress: 0,
    remainingAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCompleted, setFilterCompleted] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  
  // Modalne okna są już zaimplementowane i zaimportowane
  
  // Fetch savings goals and stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Determine if we need to filter by completion status
      let isCompleted: boolean | undefined;
      if (filterCompleted === 'completed') {
        isCompleted = true;
      } else if (filterCompleted === 'active') {
        isCompleted = false;
      }
      
      // Fetch goals and stats in parallel
      const [goalsData, statsData] = await Promise.all([
        getSavingsGoals(TEMP_USER_ID, isCompleted),
        getSavingsGoalStats(TEMP_USER_ID)
      ]);
      
      setSavingsGoals(goalsData);
      setStats(statsData);
    } catch (err) {
      setError('Nie udało się pobrać danych. Spróbuj ponownie później.');
      console.error('Error fetching savings goals data:', err);
    } finally {
      setLoading(false);
    }
  }, [filterCompleted]);
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [filterCompleted, fetchData]);
  
  // Handle deleting a goal
  const handleDeleteGoal = async (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten cel oszczędnościowy?')) {
      try {
        await deleteSavingsGoal(id, TEMP_USER_ID);
        // Refresh data after deletion
        fetchData();
      } catch (err) {
        setError('Nie udało się usunąć celu. Spróbuj ponownie później.');
        console.error('Error deleting savings goal:', err);
      }
    }
  };
  
  // Handle opening the contribution modal
  const handleAddContribution = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsContributionModalOpen(true);
  };
  
  // Handle successful contribution or goal creation
  const handleSuccess = () => {
    console.log('Sukces! Odświeżam dane...');
    // Wymuś ponowne pobranie danych po dodaniu nowego celu lub wpłaty
    setTimeout(() => {
      fetchData();
    }, 500); // Dodajemy małe opóźnienie, aby upewnić się, że dane są zaktualizowane w bazie
  };
  
  // Sort goals
  const sortedGoals = [...savingsGoals].sort((a, b) => {
    if (sortBy === 'progress') {
      const progressA = calculateProgress(a.currentAmount, a.targetAmount);
      const progressB = calculateProgress(b.currentAmount, b.targetAmount);
      return progressB - progressA;
    } else if (sortBy === 'deadline') {
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    } else if (sortBy === 'amount') {
      return b.targetAmount - a.targetAmount;
    }
    return 0;
  });
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cele oszczędnościowe</h1>
          <p className="text-gray-500 mt-1">Planuj i śledź postępy swoich celów finansowych</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowy cel</span>
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Overall progress */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-full mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <SavingsProgressCard
          totalSaved={stats.totalSaved}
          totalTarget={stats.totalTarget}
          progress={stats.progress}
          remainingAmount={stats.remainingAmount}
        />
      )}
      
      {/* Filters and sorting */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value)}
              disabled={loading}
            >
              <option value="all">Wszystkie cele</option>
              <option value="active">W trakcie</option>
              <option value="completed">Ukończone</option>
            </select>
          </div>
          
          <div className="md:w-48">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sortuj według</label>
            <select
              id="sortBy"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={loading}
            >
              <option value="progress">Postęp</option>
              <option value="deadline">Termin</option>
              <option value="amount">Kwota</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Savings goals grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedGoals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysUntil = getDaysUntil(goal.targetDate.toString());
            const monthlyContribution = calculateMonthlyContribution(goal);
            
            return (
              <SavingsGoalCard
                key={goal.id}
                goal={goal}
                progress={progress}
                daysUntil={daysUntil}
                monthlyContribution={monthlyContribution}
                formattedCurrentAmount={formatCurrency(goal.currentAmount)}
                formattedTargetAmount={formatCurrency(goal.targetAmount)}
                formattedDeadline={formatDate(goal.targetDate.toString())}
                formattedMonthlyContribution={formatCurrency(monthlyContribution)}
                onDelete={handleDeleteGoal}
                onAddContribution={handleAddContribution}
              />
            );
          })}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && sortedGoals.length === 0 && (
        <EmptyStateCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Brak celów oszczędnościowych"
          description="Nie znaleziono celów spełniających wybrane kryteria."
          actionButton={
            <button 
              onClick={() => setIsNewGoalModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Dodaj nowy cel</span>
            </button>
          }
        />
      )}
      
      {/* Savings tips */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Wskazówka oszczędnościowa</h3>
            <p className="text-indigo-800">
              Automatyzacja oszczędzania to najprostszy sposób na osiągnięcie celów. Ustaw stałe zlecenie na dzień po otrzymaniu wynagrodzenia, 
              aby konsekwentnie odkładać pieniądze bez konieczności podejmowania decyzji każdego miesiąca.
            </p>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {isNewGoalModalOpen && (
        <NewSavingsGoalModal 
          isOpen={isNewGoalModalOpen}
          onClose={() => setIsNewGoalModalOpen(false)}
          onSuccess={handleSuccess}
          userId={TEMP_USER_ID}
        />
      )}
      
      {isContributionModalOpen && selectedGoalId && (
        <AddContributionModal
          isOpen={isContributionModalOpen}
          onClose={() => {
            setIsContributionModalOpen(false);
            setSelectedGoalId(null);
          }}
          onSuccess={handleSuccess}
          goalId={selectedGoalId}
          userId={TEMP_USER_ID}
        />
      )}
    </div>
  );
}
