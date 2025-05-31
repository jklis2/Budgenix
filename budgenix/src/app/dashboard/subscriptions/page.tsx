"use client";
import { useState, useEffect } from 'react';
import { 
  formatCurrency, 
  getDaysUntil, 
  subscriptionTips
} from '@/constants/subscriptionsData';

// Aktualizacja interfejsu Subscription, aby używał string zamiast number dla id
interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: string;
  nextPayment: string;
  category: string;
  logo: string;
  color: string;
  active: boolean;
  accountId?: string;
}

// Interfejs dla danych z API
interface ApiSubscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  categoryId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  accountId?: string;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
    isIncome: boolean;
  };
}
import { SubscriptionModal } from '@/components/ui/SubscriptionModal';
import SubscriptionSummaryCard from '@/components/ui/SubscriptionSummaryCard';
import UpcomingPaymentCard from '@/components/ui/UpcomingPaymentCard';
import SubscriptionTable from '@/components/ui/SubscriptionTable';


import SubscriptionTipCard from '@/components/ui/SubscriptionTipCard';
import { SearchBar } from '@/components/ui/SearchBar';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayments, setProcessingPayments] = useState(false);
  const [paymentResults, setPaymentResults] = useState<{
    processed: number;
    total: number;
    payments?: Array<{
      subscriptionId: string;
      name: string;
      amount: number;
      accountName: string;
      newBalance: number;
      nextBillingDate: string;
      transactionId: string;
    }>;
    errors?: Array<{
      subscriptionId: string;
      name: string;
      error: string;
      account?: string;
      required?: number;
      available?: number;
    }>;
  } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  // Fetch subscriptions from API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Nie jesteś zalogowany. Zaloguj się, aby zobaczyć swoje subskrypcje.');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/subscriptions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform the API response to match our frontend Subscription model
        const transformedData: Subscription[] = data.map((sub: ApiSubscription) => ({
          id: sub.id,
          name: sub.name,
          amount: sub.amount,
          cycle: sub.billingCycle,
          nextPayment: new Date(sub.nextBillingDate).toISOString().split('T')[0],
          category: sub.category?.name || 'Inne',
          logo: sub.category?.icon || '🔔',
          color: sub.category?.color || 'blue',
          active: true, // Since we don't have this in the database yet
          accountId: sub.accountId || undefined
        }));
        
        setSubscriptions(transformedData);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
        setError('Nie udało się pobrać subskrypcji. Spróbuj ponownie później.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Process subscription payments
  const processSubscriptionPayments = async () => {
    setProcessingPayments(true);
    setPaymentResults(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Nie jesteś zalogowany');
      }
      
      const response = await fetch('/api/subscriptions/process-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas przetwarzania płatności');
      }
      
      const results = await response.json();
      setPaymentResults(results);
      
      // Odśwież listę subskrypcji po przetworzeniu płatności
      const fetchSubscriptions = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Get token from localStorage
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Nie jesteś zalogowany. Zaloguj się, aby zobaczyć swoje subskrypcje.');
            setIsLoading(false);
            return;
          }

          const response = await fetch('/api/subscriptions', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          // Transform the API response to match our frontend Subscription model
          const transformedData: Subscription[] = data.map((sub: ApiSubscription) => ({
            id: sub.id,
            name: sub.name,
            amount: sub.amount,
            cycle: sub.billingCycle,
            nextPayment: new Date(sub.nextBillingDate).toISOString().split('T')[0],
            category: sub.category?.name || 'Inne',
            logo: sub.category?.icon || '🔔',
            color: sub.category?.color || 'blue',
            active: true, // Since we don't have this in the database yet
            accountId: sub.accountId || undefined
          }));
          
          setSubscriptions(transformedData);
        } catch (err) {
          console.error('Error fetching subscriptions:', err);
          setError('Nie udało się pobrać subskrypcji. Spróbuj ponownie później.');
        } finally {
          setIsLoading(false);
        }
      };

      await fetchSubscriptions();
      
      // Pokaż powiadomienie o sukcesie
      alert(`Przetworzono ${results.processed} z ${results.total} płatności subskrypcji.`);
    } catch (err: unknown) {
      console.error('Error processing subscription payments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      alert(`Błąd podczas przetwarzania płatności: ${errorMessage}`);
    } finally {
      setProcessingPayments(false);
    }
  };

  // Get all unique categories
  const categories = ['all', ...new Set(subscriptions.map(s => s.category))];
  
  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || subscription.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && subscription.active) || 
      (filterStatus === 'inactive' && !subscription.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Calculate totals
  const monthlyTotal = subscriptions
    .filter(s => s.active && s.cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);
  
  const yearlyTotal = monthlyTotal * 12;
  
  // Toggle subscription status
  const toggleStatus = async (id: string) => {
    try {
      // Find the subscription to toggle
      const subscription = subscriptions.find(sub => sub.id === id);
      if (!subscription) return;
      
      // Optimistically update UI
      setSubscriptions(subscriptions.map(sub => 
        sub.id === id ? {...sub, active: !sub.active} : sub
      ));
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Nie jesteś zalogowany');
      }
      
      // In a real implementation, we would update the active status in the backend
      // Since we don't have an active field in the database yet, this is just a UI change
      // When the active field is added to the database schema, uncomment this code:
      
      /*
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...subscription,
          active: !subscription.active
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        // Revert the optimistic update
        setSubscriptions(subscriptions.map(sub => 
          sub.id === id ? {...sub, active: subscription.active} : sub
        ));
      }
      */
      
    } catch (err) {
      console.error('Error toggling subscription status:', err);
      alert('Nie udało się zmienić statusu subskrypcji. Spróbuj ponownie później.');
    }
  };
  
  // Delete subscription
  const deleteSubscription = async (id: string) => {
    try {
      // Optimistically update UI
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Nie jesteś zalogowany');
      }
      
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        // Revert the optimistic update if there was an error
        const originalSubscriptions = await fetch('/api/subscriptions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json());
        
        setSubscriptions(originalSubscriptions);
      }
    } catch (err) {
      console.error('Error deleting subscription:', err);
      alert('Nie udało się usunąć subskrypcji. Spróbuj ponownie później.');
    }
  };

  // Add new subscription
  const addSubscription = async (subscriptionData: Partial<Subscription>) => {
    setIsSubmitting(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Nie jesteś zalogowany');
      }
      
      // Sprawdzamy, czy wszystkie wymagane pola są dostępne
      if (!subscriptionData.name || !subscriptionData.amount || 
          !subscriptionData.cycle || !subscriptionData.nextPayment) {
        throw new Error('Brakuje wymaganych pól: nazwa, kwota, cykl płatności, data płatności');
      }
      
      // Prepare data for API
      const apiData = {
        name: subscriptionData.name,
        amount: subscriptionData.amount,
        cycle: subscriptionData.cycle,
        nextPayment: subscriptionData.nextPayment,
        category: subscriptionData.category,
        logo: subscriptionData.logo || '📱',
        color: subscriptionData.color || 'blue',
        active: subscriptionData.active !== undefined ? subscriptionData.active : true,
        accountId: subscriptionData.accountId
      };
      
      console.log('Sending subscription data:', apiData);
      
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newSubscription = await response.json();
      
      // Transform the API response to match our frontend Subscription model
      const transformedSubscription: Subscription = {
        id: newSubscription.id,
        name: newSubscription.name,
        amount: newSubscription.amount,
        cycle: newSubscription.billingCycle,
        nextPayment: new Date(newSubscription.nextBillingDate).toISOString().split('T')[0],
        category: newSubscription.category?.name || 'Inne',
        logo: newSubscription.logo || '🔔',
        color: newSubscription.color || 'blue',
        active: true,
        accountId: newSubscription.accountId
      };
      
      // Add the new subscription to the list
      setSubscriptions([...subscriptions, transformedSubscription]);
      
      // Close the modal
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding subscription:', err);
      alert('Nie udało się dodać subskrypcji. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Sort by upcoming payments
  const upcomingPayments = [...subscriptions]
    .filter(s => s.active)
    .sort((a, b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime())
    .slice(0, 3);
  
  // Summary cards data
  const summaryCards = [
    {
      title: 'Miesięczny koszt',
      value: formatCurrency(monthlyTotal),
      colorClass: 'text-indigo-600',
      bgColorClass: 'bg-indigo-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Roczny koszt',
      value: formatCurrency(yearlyTotal),
      colorClass: 'text-red-600',
      bgColorClass: 'bg-red-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Aktywne subskrypcje',
      value: subscriptions.filter(s => s.active).length.toString(),
      colorClass: 'text-emerald-600',
      bgColorClass: 'bg-emerald-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subskrypcje</h1>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Tabela
            </button>
          </div>
          <button
            onClick={processSubscriptionPayments}
            disabled={processingPayments}
            className={`${processingPayments ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded transition-colors mr-2`}
          >
            {processingPayments ? 'Przetwarzanie...' : 'Sprawdź płatności'}
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Dodaj subskrypcję
          </button>
        </div>
      </div>
      
      {/* Subscription summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <SubscriptionSummaryCard
            key={index}
            title={card.title}
            value={card.value}
            colorClass={card.colorClass}
            bgColorClass={card.bgColorClass}
            icon={card.icon}
          />
        ))}
      </div>
      
      {/* Upcoming payments */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Nadchodzące płatności</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingPayments.map((subscription) => (
            <UpcomingPaymentCard
              key={subscription.id}
              subscription={subscription}
              daysUntil={getDaysUntil(subscription.nextPayment)}
              formattedAmount={formatCurrency(subscription.amount)}
            />
          ))}
          
          {upcomingPayments.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Brak nadchodzących płatności</h3>
              <p className="text-gray-500">Nie masz żadnych aktywnych subskrypcji z nadchodzącymi płatnościami.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Results */}
      {paymentResults && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Wyniki przetwarzania płatności</h2>
          <div className="space-y-2">
            <p>Przetworzono: {paymentResults.processed} z {paymentResults.total} płatności</p>
            
            {paymentResults.payments && paymentResults.payments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Zrealizowane płatności:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {paymentResults.payments.map((payment, index) => (
                    <li key={index}>
                      {payment.name}: {payment.amount} PLN z konta {payment.accountName}. 
                      Nowe saldo: {payment.newBalance} PLN. 
                      Następna płatność: {new Date(payment.nextBillingDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {paymentResults.errors && paymentResults.errors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2 text-red-600">Błędy:</h3>
                <ul className="list-disc pl-5 space-y-1 text-red-600">
                  {paymentResults.errors.map((error, index) => (
                    <li key={index}>
                      {error.name}: {error.error}
                      {error.account && ` (Konto: ${error.account})`}
                      {error.required && error.available && ` (Wymagane: ${error.required} PLN, Dostępne: ${error.available} PLN)`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <SearchBar 
              id="subscription-search"
              label="Szukaj subskrypcji"
              placeholder="Wyszukaj po nazwie..."
              value={searchTerm}
              onChange={(value: string) => setSearchTerm(value)}
            />
          </div>
          
          <div className="md:w-64">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
            <select
              id="category"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Wszystkie kategorie' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:w-64">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywne</option>
              <option value="inactive">Nieaktywne</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Subscriptions list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Lista subskrypcji</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Ładowanie subskrypcji...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Wystąpił błąd</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Brak subskrypcji</h3>
            <p className="text-gray-500">Nie masz jeszcze żadnych subskrypcji lub żadna nie pasuje do wybranych filtrów.</p>
          </div>
        ) : (
          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            onToggleStatus={toggleStatus}
            onDelete={deleteSubscription}
          />
        )}
      </div>
      
      {/* Subscription tips */}
      {subscriptionTips.map((tip, index) => (
        <SubscriptionTipCard
          key={index}
          title={tip.title}
          content={tip.content}
          icon={tip.icon}
        />
      ))}
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addSubscription}
        isSubmitting={isSubmitting}
        title="Nowa subskrypcja"
      />
    </div>
  );
}