import React, { useState, useEffect } from 'react';
import { Account } from '@/constants/accountsData';
import { Category } from '@/lib/services/categoryService';
import { getCategories } from '@/lib/services/categoryService';
import { buildApiUrl } from '@/lib/utils/apiUrl';

// Lokalny interfejs Subscription, który używa string jako typ dla id
interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: string;
  nextPayment: string;
  category: string;
  logo: string; // Zachowujemy dla kompatybilności wstecznej
  icon?: string; // Nowe pole dla ikony
  color: string;
  active: boolean;
  accountId?: string;
}

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (subscriptionData: Partial<Subscription>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Predefined icons for subscriptions
const iconOptions = [
  { name: 'Netflix', value: '🎬' },
  { name: 'Spotify', value: '🎵' },
  { name: 'YouTube', value: '📺' },
  { name: 'Siłownia', value: '💪' },
  { name: 'Ubezpieczenie', value: '🛡️' },
  { name: 'Cloud', value: '☁️' },
  { name: 'Office', value: '💼' },
  { name: 'Gry', value: '🎮' },
  { name: 'Książki', value: '📚' },
  { name: 'Streaming', value: '🍿' },
  { name: 'Zdrowie', value: '❤️' },
  { name: 'Transport', value: '🚗' },
  { name: 'Edukacja', value: '🎓' },
  { name: 'Jedzenie', value: '🍔' },
  { name: 'Inne', value: '📱' }
];

// Payment cycle options
const cycleOptions = [
  { name: 'Tygodniowo', value: 'weekly' },
  { name: 'Miesięcznie', value: 'monthly' },
  { name: 'Kwartalnie', value: 'quarterly' },
  { name: 'Rocznie', value: 'yearly' }
];

export function SubscriptionForm({ subscription, onSubmit, onCancel, isSubmitting }: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    cycle: 'monthly',
    logo: '📱', // Zachowujemy dla kompatybilności wstecznej
    icon: '📱', // Nowe pole dla ikony
    color: 'blue',
    category: '',
    accountId: '',
    active: true,
    nextPayment: new Date().toISOString().split('T')[0] // Dzisiejsza data jako domyślna
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount,
        cycle: subscription.cycle,
        logo: subscription.logo,
        icon: subscription.icon || subscription.logo, // Używamy icon jeśli istnieje, w przeciwnym razie logo
        color: subscription.color,
        category: subscription.category,
        accountId: subscription.accountId || '',
        active: subscription.active,
        nextPayment: subscription.nextPayment || new Date().toISOString().split('T')[0]
      });
    }
  }, [subscription]);

  // Fetch categories and accounts when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Fetch accounts
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(buildApiUrl("/api/accounts"), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const accountsData = await response.json();
            setAccounts(accountsData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Używamy daty wybranej przez użytkownika i synchronizujemy logo z icon dla kompatybilności
    const subscriptionData = {
      ...formData,
      logo: formData.icon // Synchronizujemy logo z icon dla kompatybilności wstecznej
    };
    
    onSubmit(subscriptionData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              {option.value} {option.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nazwa subskrypcji
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Np. Netflix, Spotify, HBO Max"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Kwota (PLN)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="cycle" className="block text-sm font-medium text-gray-700 mb-1">
          Okres płatności
        </label>
        <select
          id="cycle"
          name="cycle"
          value={formData.cycle}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {cycleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="nextPayment" className="block text-sm font-medium text-gray-700 mb-1">
          Data płatności
        </label>
        <input
          type="date"
          id="nextPayment"
          name="nextPayment"
          value={formData.nextPayment}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Kategoria wydatków
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Wybierz kategorię</option>
          {categories
            .filter(category => !category.isIncome) // Only show expense categories
            .map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))
          }
        </select>
      </div>

      <div>
        <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1">
          Konto płatności
        </label>
        <select
          id="accountId"
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Wybierz konto</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.balance} {account.currency})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          name="active"
          checked={formData.active}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
          Aktywna subskrypcja
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
          {isSubmitting ? 'Zapisywanie...' : subscription ? 'Aktualizuj' : 'Dodaj'}
        </button>
      </div>
    </form>
  );
}
