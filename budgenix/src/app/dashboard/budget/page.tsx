"use client";
import { useState } from 'react';

export default function Budget() {
  // Dummy data for demonstration
  const [currentMonth] = useState("Marzec 2025");
  const [totalBudget] = useState(10000);
  const [spentAmount] = useState(5200.25);
  const [remainingAmount] = useState(totalBudget - spentAmount);
  const [spentPercentage] = useState(Math.round((spentAmount / totalBudget) * 100));
  
  const budgetCategories = [
    { id: 1, name: 'Mieszkanie', allocated: 3000, spent: 2800, color: 'indigo' },
    { id: 2, name: 'Żywność', allocated: 2000, spent: 1450, color: 'emerald' },
    { id: 3, name: 'Transport', allocated: 1000, spent: 420, color: 'blue' },
    { id: 4, name: 'Rozrywka', allocated: 800, spent: 350, color: 'purple' },
    { id: 5, name: 'Subskrypcje', allocated: 200, spent: 180, color: 'amber' },
    { id: 6, name: 'Oszczędności', allocated: 3000, spent: 0, color: 'green' },
  ];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate percentage
  const calculatePercentage = (spent: number, allocated: number) => {
    return Math.round((spent / allocated) * 100);
  };
  
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
            <span className="text-gray-700 font-medium">{currentMonth}</span>
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
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-sm text-indigo-700 font-medium mb-1">Całkowity budżet</div>
            <div className="text-2xl font-bold text-indigo-900">{formatCurrency(totalBudget)}</div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-sm text-emerald-700 font-medium mb-1">Pozostało</div>
            <div className="text-2xl font-bold text-emerald-900">{formatCurrency(remainingAmount)}</div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-sm text-amber-700 font-medium mb-1">Wydano</div>
            <div className="text-2xl font-bold text-amber-900">{formatCurrency(spentAmount)}</div>
          </div>
        </div>
        
        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">Postęp budżetu</div>
          <div className="text-sm font-medium text-gray-700">{spentPercentage}%</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${spentPercentage > 90 ? 'bg-red-600' : spentPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${spentPercentage}%` }}
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
          {budgetCategories.map((category) => {
            const percentage = calculatePercentage(category.spent, category.allocated);
            
            return (
              <div key={category.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500 mr-2`}></div>
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${category.color}-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">
                    {percentage > 100 ? (
                      <span className="text-red-600">Przekroczono o {percentage - 100}%</span>
                    ) : (
                      <span>Wykorzystano {percentage}%</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Pozostało: {formatCurrency(category.allocated - category.spent)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Budget actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Dostosuj budżet</h3>
          </div>
          <p className="text-indigo-200 mb-4">Dostosuj swój budżet do zmieniających się potrzeb i celów finansowych</p>
          <button className="w-full bg-white text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
            Edytuj budżet
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Raport budżetu</h3>
          </div>
          <p className="text-emerald-200 mb-4">Generuj szczegółowy raport z wydatków i oszczędności w tym miesiącu</p>
          <button className="w-full bg-white text-emerald-700 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
            Generuj raport
          </button>
        </div>
      </div>
      
      {/* Budget tips */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Wskazówka budżetowa</h3>
            <p className="text-indigo-800">
              Spróbuj zastosować regułę 50/30/20 w swoim budżecie: 50% na potrzeby, 30% na zachcianki i 20% na oszczędności.
              To pomoże Ci zrównoważyć wydatki i systematycznie budować oszczędności.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}