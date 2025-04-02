import React, { useState, useEffect } from 'react';
import { Category } from '@/lib/services/categoryService';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (categoryData: Partial<Category>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Predefiniowane kolory dla kategorii
const colorOptions = [
  { name: 'Czerwony', value: '#F44336' },
  { name: 'Różowy', value: '#E91E63' },
  { name: 'Fioletowy', value: '#9C27B0' },
  { name: 'Indygo', value: '#3F51B5' },
  { name: 'Niebieski', value: '#2196F3' },
  { name: 'Błękitny', value: '#03A9F4' },
  { name: 'Turkusowy', value: '#00BCD4' },
  { name: 'Zielony', value: '#4CAF50' },
  { name: 'Limonkowy', value: '#8BC34A' },
  { name: 'Żółty', value: '#FFEB3B' },
  { name: 'Pomarańczowy', value: '#FF9800' },
  { name: 'Brązowy', value: '#795548' },
  { name: 'Szary', value: '#9E9E9E' }
];

// Predefiniowane ikony dla kategorii
const iconOptions = [
  { name: 'Oszczędności', value: 'savings' },
  { name: 'Rachunki', value: 'receipt' },
  { name: 'Rozrywka', value: 'movie' },
  { name: 'Subskrypcje', value: 'subscriptions' },
  { name: 'Transport', value: 'directions_car' },
  { name: 'Zdrowie', value: 'medical_services' },
  { name: 'Żywność', value: 'restaurant' },
  { name: 'Przychód', value: 'payments' },
  { name: 'Dom', value: 'home' },
  { name: 'Zakupy', value: 'shopping_cart' },
  { name: 'Edukacja', value: 'school' },
  { name: 'Podróże', value: 'flight' },
  { name: 'Prezenty', value: 'card_giftcard' },
  { name: 'Ubrania', value: 'checkroom' },
  { name: 'Elektronika', value: 'devices' },
  { name: 'Sport', value: 'sports_soccer' },
  { name: 'Zwierzęta', value: 'pets' },
  { name: 'Inne', value: 'more_horiz' }
];

export function CategoryForm({ category, onSubmit, onCancel, isSubmitting }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    icon: 'more_horiz',
    color: '#4CAF50',
    isIncome: false
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color,
        isIncome: category.isIncome
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nazwa kategorii
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Np. Żywność, Transport, Rozrywka"
        />
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
          Ikona
        </label>
        <select
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {iconOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="mt-2 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <span className="material-icons text-gray-600">{formData.icon}</span>
          </div>
          <span className="text-sm text-gray-500">Podgląd ikony</span>
        </div>
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
          Kolor
        </label>
        <select
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {colorOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="mt-2 flex items-center">
          <div 
            className="w-8 h-8 rounded-full mr-2"
            style={{ backgroundColor: formData.color }}
          ></div>
          <span className="text-sm text-gray-500">Podgląd koloru</span>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isIncome"
          name="isIncome"
          checked={formData.isIncome}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isIncome" className="ml-2 block text-sm text-gray-700">
          To jest kategoria przychodów
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Zapisywanie...' : category ? 'Aktualizuj' : 'Dodaj'}
        </button>
      </div>
    </form>
  );
}
