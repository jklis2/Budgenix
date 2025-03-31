"use client";
import { useState } from 'react';
import { 
  savingsGoals as initialSavingsGoals, 
  formatCurrency, 
  formatDate, 
  getDaysUntil, 
  calculateProgress, 
  calculateMonthlyContribution 
} from '@/constants/savingsGoalsData';
import SavingsProgressCard from '@/components/ui/SavingsProgressCard';
import SavingsGoalCard from '@/components/ui/SavingsGoalCard';
import EmptyStateCard from '@/components/ui/EmptyStateCard';

export default function SavingsGoals() {
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals);
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  
  // Filter and sort goals
  const filteredGoals = savingsGoals
    .filter(goal => filterPriority === 'all' || goal.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === 'progress') {
        const progressA = calculateProgress(a.currentAmount, a.targetAmount);
        const progressB = calculateProgress(b.currentAmount, b.targetAmount);
        return progressB - progressA;
      } else if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === 'amount') {
        return b.targetAmount - a.targetAmount;
      }
      return 0;
    });
  
  // Calculate total savings
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = calculateProgress(totalSaved, totalTarget);
  
  // Delete goal
  const deleteGoal = (id: number) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cele oszczędnościowe</h1>
          <p className="text-gray-500 mt-1">Planuj i śledź postępy swoich celów finansowych</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowy cel</span>
          </button>
        </div>
      </div>
      
      {/* Overall progress */}
      <SavingsProgressCard
        totalSaved={totalSaved}
        totalTarget={totalTarget}
        progress={overallProgress}
        remainingAmount={totalTarget - totalSaved}
      />
      
      {/* Filters and sorting */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priorytet</label>
            <select
              id="priority"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Wszystkie priorytety</option>
              <option value="high">Wysoki</option>
              <option value="medium">Średni</option>
              <option value="low">Niski</option>
            </select>
          </div>
          
          <div className="md:w-48">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sortuj według</label>
            <select
              id="sortBy"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="progress">Postęp</option>
              <option value="deadline">Termin</option>
              <option value="amount">Kwota</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Savings goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const daysUntil = getDaysUntil(goal.deadline);
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
              formattedDeadline={formatDate(goal.deadline)}
              formattedMonthlyContribution={formatCurrency(monthlyContribution)}
              onDelete={deleteGoal}
            />
          );
        })}
      </div>
      
      {/* Empty state */}
      {filteredGoals.length === 0 && (
        <EmptyStateCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Brak celów oszczędnościowych"
          description="Nie znaleziono celów spełniających wybrane kryteria."
          actionButton={
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
    </div>
  );
}