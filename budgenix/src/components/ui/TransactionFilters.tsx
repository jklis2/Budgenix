import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './SearchBar';
import { Category, Account, TransactionFilters } from '@/lib/services/transactionService';

interface TransactionFiltersProps {
  categories: Category[];
  accounts: Account[];
  onFilterChange: (filters: TransactionFilters) => void;
  initialFilters?: TransactionFilters;
}

// Typ pomocniczy do obsługi różnych typów wartości w filtrach
type FilterValue = string | number | boolean | undefined;

// Typ pomocniczy do obsługi wszystkich możliwych kluczy w filtrach
type AllFilterKeys = keyof TransactionFilters;

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  categories,
  accounts,
  onFilterChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = useCallback((name: AllFilterKeys, value: FilterValue) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      // Jeśli wartość jest pusta, usuń filtr
      if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
        delete updatedFilters[name];
      } else {
        // Używamy typowanych przypisań dla różnych kluczy
        switch (name) {
          case 'search':
          case 'categoryId':
          case 'accountId':
          case 'paymentMethod':
          case 'dateFrom':
          case 'dateTo':
          case 'sortBy':
            updatedFilters[name] = value as string;
            break;
          case 'isIncome':
            updatedFilters[name] = value as boolean;
            break;
          case 'sortOrder':
            updatedFilters[name] = value as 'asc' | 'desc';
            break;
          // Dla innych przypadków, które mogą pojawić się w przyszłości
          // Używamy bardziej typowanego podejścia zamiast any
          default:
            // Jeśli to string
            if (typeof value === 'string') {
              (updatedFilters as Record<string, string>)[name] = value;
            } 
            // Jeśli to number
            else if (typeof value === 'number') {
              (updatedFilters as Record<string, number>)[name] = value;
            }
            // Jeśli to boolean
            else if (typeof value === 'boolean') {
              (updatedFilters as Record<string, boolean>)[name] = value;
            }
        }
      }
      
      return updatedFilters;
    });
  }, []);

  // Effect do aktualizacji filtrów po zmianie
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Effect do opóźnienia wyszukiwania podczas pisania
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== filters.search) {
        handleFilterChange('search', searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters.search, handleFilterChange]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filtry</h3>
          <div className="flex space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Wyczyść filtry
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              {isExpanded ? 'Mniej filtrów' : 'Więcej filtrów'}
              <svg
                className={`ml-1 h-5 w-5 transform ${isExpanded ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <SearchBar
            id="transaction-search"
            placeholder="Szukaj transakcji..."
            value={searchTerm}
            onChange={(value: string) => setSearchTerm(value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Kategoria
              </label>
              <select
                id="category-filter"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                <option value="">Wszystkie kategorie</option>
                <optgroup label="Przychody">
                  {categories
                    .filter(category => category.isIncome)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  }
                </optgroup>
                <optgroup label="Wydatki">
                  {categories
                    .filter(category => !category.isIncome)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  }
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="account-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Konto
              </label>
              <select
                id="account-filter"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.accountId || ''}
                onChange={(e) => handleFilterChange('accountId', e.target.value)}
              >
                <option value="">Wszystkie konta</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isExpanded && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                    Data od
                  </label>
                  <input
                    type="date"
                    id="date-from"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                  />
                </div>

                <div>
                  <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                    Data do
                  </label>
                  <input
                    type="date"
                    id="date-to"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                  Metoda płatności
                </label>
                <select
                  id="payment-method"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={filters.paymentMethod || ''}
                  onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                >
                  <option value="">Wszystkie metody</option>
                  <option value="Karta debetowa">Karta debetowa</option>
                  <option value="Karta kredytowa">Karta kredytowa</option>
                  <option value="Gotówka">Gotówka</option>
                  <option value="Przelew">Przelew</option>
                  <option value="BLIK">BLIK</option>
                  <option value="Inna">Inna</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Typ transakcji
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        name="transaction-type"
                        checked={filters.isIncome === undefined}
                        onChange={() => handleFilterChange('isIncome', undefined)}
                      />
                      <span className="ml-2 text-sm text-gray-700">Wszystkie</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        name="transaction-type"
                        checked={filters.isIncome === true}
                        onChange={() => handleFilterChange('isIncome', true)}
                      />
                      <span className="ml-2 text-sm text-gray-700">Przychody</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        name="transaction-type"
                        checked={filters.isIncome === false}
                        onChange={() => handleFilterChange('isIncome', false)}
                      />
                      <span className="ml-2 text-sm text-gray-700">Wydatki</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sortowanie
                  </label>
                  <div className="flex space-x-2">
                    <select
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={filters.sortBy || 'date'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="date">Data</option>
                      <option value="amount">Kwota</option>
                      <option value="title">Nazwa</option>
                      <option value="category">Kategoria</option>
                    </select>
                    <select
                      className="block w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={filters.sortOrder || 'desc'}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                    >
                      <option value="desc">Malejąco</option>
                      <option value="asc">Rosnąco</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionFiltersComponent;
