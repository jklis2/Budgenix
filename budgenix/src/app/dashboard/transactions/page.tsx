"use client";
import { useState, useEffect } from 'react';
import { formatCurrency, transactionTips } from '@/constants/transactionsData';
import TransactionSummaryCard from '@/components/ui/TransactionSummaryCard';
import TransactionTable from '@/components/ui/TransactionTable';
import { TipCard } from '@/components/ui/TipCard';
import TransactionFiltersComponent from '@/components/ui/TransactionFilters';
import { 
  Transaction, 
  TransactionFilters, 
  getTransactions, 
  Category, 
  Account, 
  
  deleteTransaction, 
  getCategories, 
  getAccounts,
  createTransaction,
  updateTransaction,
  TransactionCreateInput
} from '@/lib/services/transactionService';
import TransactionModal from '@/components/ui/TransactionModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Toast from '@/components/ui/Toast';
import { exportTransactionsToExcel } from '@/lib/exportTransactionsToExcel';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  
  // DOMYŚLNY FILTR: Bieżący miesiąc (od 1 do ostatniego dnia)
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  // POPRAWKA: Używamy lokalnego formatowania zamiast UTC
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [filters, setFilters] = useState<TransactionFilters>({
    dateFrom: formatLocalDate(firstDay),
    dateTo: formatLocalDate(lastDay)
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modalne
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>(undefined);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  
  // Toast
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  // Pobieranie danych
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getTransactions(filters);

        // Proste wyszukiwanie po stronie frontu po tytule transakcji
        const searchTerm = (filters.search || '').toLowerCase();
        let visibleTransactions = response.transactions;

        if (searchTerm) {
          visibleTransactions = response.transactions.filter(tx =>
            (tx.title || '').toLowerCase().includes(searchTerm)
          );
        }

        setTransactions(visibleTransactions);
        setTotalCount(visibleTransactions.length);

        // Statystyki liczone z aktualnie widocznych transakcji
        // POPRAWKA: Filtrujemy po category.isIncome zamiast po znaku amount dla spójności
        const income = visibleTransactions
          .filter(tx => tx.category?.isIncome === true)
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        // Wydatki: wszystkie kategorie wydatkowe BEZ "Oszczędności" (wpłaty na cele oszczędnościowe)
        const expenses = visibleTransactions
          .filter(tx => tx.category?.isIncome === false && tx.category?.name !== 'Oszczędności')
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        const balance = income - expenses;

        setStats({
          income,
          expenses,
          balance,
        });
        
        // Pobieranie kategorii i kont z API
        try {
          const categoriesData = await getCategories();
          setCategories(categoriesData);
        } catch (error) {
          console.error('Błąd podczas pobierania kategorii:', error);
          setCategories([]);
        }
        
        try {
          const accountsData = await getAccounts();
          setAccounts(accountsData);
        } catch (error) {
          console.error('Błąd podczas pobierania kont:', error);
          setAccounts([]);
        }
        
        // Dodatkowe statystyki z API mogą być pobrane osobno, jeśli będzie potrzebne

      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
        showToast('Wystąpił błąd podczas pobierania danych', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Obsługa filtrów
  const handleFilterChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  // Obsługa toastów
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Obsługa edycji transakcji
  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsTransactionModalOpen(true);
  };

  // Obsługa usuwania transakcji
  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  // Obsługa formularza transakcji
  const handleSubmitTransaction = async (data: Partial<Transaction>) => {
    try {
      setIsSubmitting(true);
      console.log('Dane transakcji do zapisania:', data);
      
      if (transactionToEdit) {
        // Aktualizacja istniejącej transakcji
        await updateTransaction(transactionToEdit.id, data);
        showToast('Transakcja została zaktualizowana', 'success');
      } else {
        // Tworzenie nowej transakcji
        const newTransactionData: TransactionCreateInput = {
          title: data.title || '',
          amount: data.amount || 0,
          date: data.date || new Date(),
          description: data.description,
          paymentMethod: data.paymentMethod || 'Karta debetowa',
          isRecurring: data.isRecurring || false,
          categoryId: data.categoryId || '',
          accountId: data.accountId || ''
        };
        await createTransaction(newTransactionData);
        showToast('Transakcja została dodana', 'success');
      }
      
      setIsTransactionModalOpen(false);
      // Odświeżenie danych - wymuszenie zmiany referencji filtrów
      setFilters(prev => ({ ...prev }));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('accountsUpdated'));
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania transakcji:', error);
      showToast('Wystąpił błąd podczas zapisywania transakcji', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transaction summary cards data
  const summaryCards = [
    {
      title: 'Przychody',
      amount: formatCurrency(stats.income),
      colorClass: 'text-emerald-600',
      bgColorClass: 'bg-emerald-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: 'Wydatki',
      amount: formatCurrency(stats.expenses),
      colorClass: 'text-red-600',
      bgColorClass: 'bg-red-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      )
    },
    {
      title: 'Bilans',
      amount: formatCurrency(stats.balance),
      colorClass: stats.balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColorClass: 'bg-blue-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    }
  ];
  
  // Function to render the appropriate icon based on the string identifier
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'download':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Toast notification */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
        />
      )}
      
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transakcje</h1>
          <p className="text-gray-500 mt-1">
            Przeglądaj i zarządzaj swoimi transakcjami • 
            <span className="ml-1 text-indigo-600 font-medium">
              {new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}
            </span>
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            onClick={() => {
              setTransactionToEdit(undefined);
              setIsTransactionModalOpen(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowa transakcja</span>
          </button>
        </div>
      </div>
      
      {/* Transaction summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <TransactionSummaryCard
            key={index}
            title={card.title}
            amount={card.amount}
            colorClass={card.colorClass}
            bgColorClass={card.bgColorClass}
            icon={card.icon}
          />
        ))}
      </div>
      
      {/* Filters */}
      <TransactionFiltersComponent
        categories={categories}
        accounts={accounts}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
      
      {/* Transactions list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Historia transakcji</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Ładowanie transakcji...</p>
          </div>
        ) : transactions.length > 0 ? (
          <TransactionTable
            transactions={transactions}
            selectedTransaction={selectedTransactionId}
            setSelectedTransaction={setSelectedTransactionId}
            totalCount={totalCount}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            isLoading={isLoading}
          />
        ) : (
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-600">Brak transakcji spełniających kryteria</p>
            <button 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => {
                setTransactionToEdit(undefined);
                setIsTransactionModalOpen(true);
              }}
            >
              Dodaj pierwszą transakcję
            </button>
          </div>
        )}
      </div>
      
      {/* Export options */}
      {transactionTips.map((tip, index) => (
        <TipCard
          key={index}
          title={tip.title}
          content={tip.description}
          icon={renderIcon(tip.icon)}
          bgColor={tip.bgColorClass}
          borderColor={tip.borderColorClass}
          titleColor={tip.textColorClass}
          contentColor={tip.descriptionColorClass}
          actions={index === 0 ? [{ label: 'Pobierz plik', onClick: () => exportTransactionsToExcel(transactions) }] : []}
        />
      ))}
      
      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          transaction={transactionToEdit}
          categories={categories}
          accounts={accounts}
          onSubmit={handleSubmitTransaction}
          isSubmitting={isSubmitting}
          title={transactionToEdit ? "Edytuj transakcję" : "Dodaj nową transakcję"}
        />
      )}
      
      {/* Confirmation Modal */}
      {isDeleteModalOpen && transactionToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
            try {
              if (transactionToDelete) {
                await deleteTransaction(transactionToDelete.id);
                setIsDeleteModalOpen(false);
                showToast('Transakcja została usunięta', 'success');
                // Odświeżenie danych - wymuszenie zmiany referencji filtrów
                setFilters(prev => ({ ...prev }));

                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('accountsUpdated'));
                }
              }
            } catch (error) {
              console.error('Błąd podczas usuwania transakcji:', error);
              showToast('Wystąpił błąd podczas usuwania transakcji', 'error');
            }
          }}
          title="Usuń transakcję"
          message={`Czy na pewno chcesz usunąć transakcję "${transactionToDelete.title}"? Ta operacja jest nieodwracalna.`}
        />
      )}
    </div>
  );
}