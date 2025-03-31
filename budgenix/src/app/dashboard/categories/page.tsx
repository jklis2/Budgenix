"use client";
import { useState } from 'react';
import { CategoryStatCard } from '@/components/ui/CategoryStatCard';
import { CategoryListItem } from '@/components/ui/CategoryListItem';
import { SearchBar } from '@/components/ui/SearchBar';
import { categoriesData } from '@/constants/categoriesData';

export default function Categories() {
  // State
  const [categories, setCategories] = useState(categoriesData);
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
  
  // Select category
  const selectCategory = (id: number) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };
  
  // Icons for stat cards
  const categoryIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
  
  const budgetIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  const spentIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
  
  const transactionsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
  
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
          value={formatCurrency(categories.reduce((sum, cat) => sum + cat.budget, 0))}
          icon={budgetIcon}
          bgColor="bg-white"
          iconBgColor="bg-emerald-100"
          textColor="text-emerald-600"
        />
        
        <CategoryStatCard
          title="Wydano"
          value={formatCurrency(categories.reduce((sum, cat) => sum + cat.spent, 0))}
          icon={spentIcon}
          bgColor="bg-white"
          iconBgColor="bg-red-100"
          textColor="text-red-600"
        />
        
        <CategoryStatCard
          title="Transakcje"
          value={categories.reduce((sum, cat) => sum + cat.transactions, 0)}
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
              onChange={setSearchTerm}
            />
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
                    formatCurrency={formatCurrency}
                    calculatePercentage={calculatePercentage}
                    onSelect={selectCategory}
                    onDelete={deleteCategory}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}