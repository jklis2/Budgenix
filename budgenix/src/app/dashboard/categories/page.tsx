"use client";
import { useState } from 'react';

export default function Categories() {
  // Dummy data for demonstration
  const [categories, setCategories] = useState([
    { id: 1, name: 'Mieszkanie', icon: '🏠', color: 'indigo', budget: 3000, spent: 2800, transactions: 5 },
    { id: 2, name: 'Żywność', icon: '🍎', color: 'emerald', budget: 2000, spent: 1450, transactions: 12 },
    { id: 3, name: 'Transport', icon: '🚗', color: 'blue', budget: 1000, spent: 420, transactions: 8 },
    { id: 4, name: 'Rozrywka', icon: '🎬', color: 'purple', budget: 800, spent: 350, transactions: 4 },
    { id: 5, name: 'Subskrypcje', icon: '📱', color: 'amber', budget: 200, spent: 180, transactions: 3 },
    { id: 6, name: 'Oszczędności', icon: '💰', color: 'green', budget: 3000, spent: 0, transactions: 1 },
    { id: 7, name: 'Rachunki', icon: '📄', color: 'red', budget: 1200, spent: 980, transactions: 6 },
    { id: 8, name: 'Zdrowie', icon: '⚕️', color: 'teal', budget: 500, spent: 120, transactions: 2 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
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
      return sortOrder === 'asc' 
        ? a.budget - b.budget 
        : b.budget - a.budget;
    } else if (sortBy === 'spent') {
      return sortOrder === 'asc' 
        ? a.spent - b.spent 
        : b.spent - a.spent;
    } else if (sortBy === 'percentage') {
      const percentA = calculatePercentage(a.spent, a.budget);
      const percentB = calculatePercentage(b.spent, b.budget);
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
  
  // Delete category (dummy function)
  const deleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    if (selectedCategory === id) {
      setSelectedCategory(null);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategorie</h1>
          <p className="text-gray-500 mt-1">Zarządzaj kategoriami wydatków i przychodów</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowa kategoria</span>
          </button>
        </div>
      </div>
      
      {/* Categories overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Wszystkie kategorie</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{categories.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Całkowity budżet</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(categories.reduce((sum, cat) => sum + cat.budget, 0))}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Wydano</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(categories.reduce((sum, cat) => sum + cat.spent, 0))}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Transakcje</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {categories.reduce((sum, cat) => sum + cat.transactions, 0)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Szukaj kategorii</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Wyszukaj kategorię..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Lista kategorii</h2>
        </div>
        
        {sortedCategories.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Brak kategorii</h3>
            <p className="text-gray-500">Nie znaleziono kategorii spełniających kryteria wyszukiwania.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-3 border-b border-gray-200 cursor-pointer" onClick={() => toggleSort('name')}>
                    <div className="flex items-center">
                      <span>Nazwa</span>
                      {sortBy === 'name' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 cursor-pointer" onClick={() => toggleSort('budget')}>
                    <div className="flex items-center">
                      <span>Budżet</span>
                      {sortBy === 'budget' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 cursor-pointer" onClick={() => toggleSort('spent')}>
                    <div className="flex items-center">
                      <span>Wydano</span>
                      {sortBy === 'spent' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 cursor-pointer" onClick={() => toggleSort('percentage')}>
                    <div className="flex items-center">
                      <span>Wykorzystano</span>
                      {sortBy === 'percentage' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedCategories.map((category) => {
                  const percentage = calculatePercentage(category.spent, category.budget);
                  
                  return (
                    <tr 
                      key={category.id} 
                      className={`hover:bg-gray-50 transition-colors ${selectedCategory === category.id ? 'bg-indigo-50' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full bg-${category.color}-100 flex items-center justify-center mr-3`}>
                            <span className="text-lg">{category.icon}</span>
                          </div>
                          <div className="font-medium text-gray-800">{category.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatCurrency(category.budget)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatCurrency(category.spent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                            <div 
                              className={`h-2 rounded-full ${percentage > 90 ? 'bg-red-600' : percentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCategory(category.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Category tips */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Wskazówka</h3>
            <p className="text-indigo-800">
              Dobrze zorganizowane kategorie pomogą Ci lepiej śledzić wydatki. Rozważ utworzenie osobnych kategorii dla stałych wydatków,
              zmiennych kosztów oraz oszczędności, aby mieć pełną kontrolę nad swoimi finansami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}