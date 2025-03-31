"use client";
import { BudgetSummaryCard } from '@/components/ui/BudgetSummaryCard';
import { BudgetCategoryCard } from '@/components/ui/BudgetCategoryCard';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { TipCard } from '@/components/ui/TipCard';
import { budgetSummaryData, budgetCategories, budgetActionsData, budgetTip } from '@/constants/budgetData';

export default function Budget() {
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
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budżet</h1>
          <p className="text-gray-500 mt-1">Planuj i zarządzaj swoimi wydatkami</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 flex items-center">
            <span className="text-gray-700 font-medium">{budgetSummaryData.currentMonth}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
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
            value={formatCurrency(budgetSummaryData.totalBudget)}
            bgColor="bg-indigo-50"
            textColor="text-indigo-700"
          />
          
          <BudgetSummaryCard
            title="Pozostało"
            value={formatCurrency(budgetSummaryData.remainingAmount)}
            bgColor="bg-emerald-50"
            textColor="text-emerald-700"
          />
          
          <BudgetSummaryCard
            title="Wydano"
            value={formatCurrency(budgetSummaryData.spentAmount)}
            bgColor="bg-amber-50"
            textColor="text-amber-700"
          />
        </div>
        
        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">Postęp budżetu</div>
          <div className="text-sm font-medium text-gray-700">{budgetSummaryData.spentPercentage}%</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${budgetSummaryData.spentPercentage > 90 ? 'bg-red-600' : budgetSummaryData.spentPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${budgetSummaryData.spentPercentage}%` }}
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
          {budgetCategories.map((category) => (
            <BudgetCategoryCard
              key={category.id}
              name={category.name}
              spent={category.spent}
              allocated={category.allocated}
              color={category.color}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      </div>
      
      {/* Budget actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetActionsData.map((action) => (
          <QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={getBudgetActionIcon(action.icon)}
            buttonText={action.buttonText}
            gradientFrom={action.gradientFrom}
            gradientTo={action.gradientTo}
            textColor={action.textColor}
          />
        ))}
      </div>
      
      {/* Budget tips */}
      <TipCard
        title={budgetTip.title}
        content={budgetTip.content}
        icon={tipIcon}
      />
    </div>
  );
}