"use client";
import { useState } from 'react';

// Define interface for savings goal
interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  contributions: { date: string; amount: number }[];
}

export default function SavingsGoals() {
  // Dummy data for demonstration
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: 1,
      name: 'Wakacje w Grecji',
      targetAmount: 8000,
      currentAmount: 4500,
      deadline: '2025-07-15',
      icon: '🏖️',
      color: 'blue',
      description: 'Wakacje all-inclusive dla całej rodziny',
      priority: 'high',
      contributions: [
        { date: '2025-01-15', amount: 1000 },
        { date: '2025-02-15', amount: 1500 },
        { date: '2025-03-15', amount: 2000 },
      ]
    },
    {
      id: 2,
      name: 'Nowy laptop',
      targetAmount: 5000,
      currentAmount: 2800,
      deadline: '2025-05-01',
      icon: '💻',
      color: 'purple',
      description: 'MacBook Pro do pracy i nauki',
      priority: 'medium',
      contributions: [
        { date: '2025-01-10', amount: 1000 },
        { date: '2025-02-10', amount: 800 },
        { date: '2025-03-10', amount: 1000 },
      ]
    },
    {
      id: 3,
      name: 'Fundusz awaryjny',
      targetAmount: 15000,
      currentAmount: 7500,
      deadline: '2025-12-31',
      icon: '🛡️',
      color: 'emerald',
      description: 'Zabezpieczenie na nieprzewidziane wydatki',
      priority: 'high',
      contributions: [
        { date: '2025-01-05', amount: 2500 },
        { date: '2025-02-05', amount: 2500 },
        { date: '2025-03-05', amount: 2500 },
      ]
    },
    {
      id: 4,
      name: 'Nowy samochód',
      targetAmount: 50000,
      currentAmount: 12000,
      deadline: '2026-06-30',
      icon: '🚗',
      color: 'red',
      description: 'Wymiana starego samochodu na nowszy model',
      priority: 'medium',
      contributions: [
        { date: '2025-01-20', amount: 4000 },
        { date: '2025-02-20', amount: 4000 },
        { date: '2025-03-20', amount: 4000 },
      ]
    },
    {
      id: 5,
      name: 'Remont mieszkania',
      targetAmount: 20000,
      currentAmount: 5000,
      deadline: '2025-09-01',
      icon: '🏠',
      color: 'amber',
      description: 'Odświeżenie kuchni i łazienki',
      priority: 'low',
      contributions: [
        { date: '2025-01-25', amount: 2000 },
        { date: '2025-02-25', amount: 1500 },
        { date: '2025-03-25', amount: 1500 },
      ]
    }
  ]);
  
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate days until deadline
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  // Calculate monthly contribution needed
  const calculateMonthlyContribution = (goal: SavingsGoal) => {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffMonths = (deadline.getFullYear() - today.getFullYear()) * 12 + 
                       (deadline.getMonth() - today.getMonth());
    
    if (diffMonths <= 0) return 0;
    
    const remaining = goal.targetAmount - goal.currentAmount;
    return remaining / diffMonths;
  };
  
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ogólny postęp oszczędzania</h2>
            <div className="flex items-center mb-2">
              <div className="flex-grow">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-4 text-lg font-semibold text-indigo-600">{overallProgress}%</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Zaoszczędzono: {formatCurrency(totalSaved)}</span>
              <span>Cel: {formatCurrency(totalTarget)}</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-center text-indigo-800 font-medium">
              Pozostało do zaoszczędzenia:
            </p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {formatCurrency(totalTarget - totalSaved)}
            </p>
          </div>
        </div>
      </div>
      
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
            <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full bg-${goal.color}-100 flex items-center justify-center mr-4`}>
                      <span className="text-2xl">{goal.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Postęp</span>
                    <span className="text-sm font-medium text-gray-700">{progress}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        progress < 30 ? 'bg-red-500' : 
                        progress < 70 ? 'bg-amber-500' : 
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Zaoszczędzono</p>
                    <p className="text-lg font-semibold text-gray-800">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cel</p>
                    <p className="text-lg font-semibold text-gray-800">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Termin</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(goal.deadline)}</p>
                    <p className={`text-xs ${
                      daysUntil < 30 ? 'text-red-600' : 
                      daysUntil < 90 ? 'text-amber-600' : 
                      'text-emerald-600'
                    }`}>
                      {daysUntil > 0 ? `Pozostało ${daysUntil} dni` : 'Termin minął'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Miesięczna wpłata</p>
                    <p className="text-sm font-medium text-gray-800">{formatCurrency(monthlyContribution)}</p>
                    <p className="text-xs text-gray-500">aby osiągnąć cel na czas</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-800' : 
                  goal.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {goal.priority === 'high' ? 'Wysoki priorytet' : 
                   goal.priority === 'medium' ? 'Średni priorytet' : 
                   'Niski priorytet'}
                </span>
                
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Dodaj wpłatę</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty state */}
      {filteredGoals.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Brak celów oszczędnościowych</h3>
          <p className="text-gray-500 mb-4">Nie znaleziono celów spełniających wybrane kryteria.</p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Dodaj pierwszy cel</span>
          </button>
        </div>
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
              Stosuj zasadę &quot;najpierw zapłać sobie&quot; - ustaw automatyczne przelewy na konto oszczędnościowe zaraz po otrzymaniu wynagrodzenia.
              To pomoże Ci konsekwentnie odkładać pieniądze i szybciej osiągnąć swoje cele finansowe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}