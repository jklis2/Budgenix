import React, { useState, useEffect } from 'react';
import { Transaction, Category, Account } from '@/lib/services/transactionService';
import { formatCurrency } from '@/constants/transactionsData';

interface TransactionFormProps {
  transaction?: Transaction;
  categories: Category[];
  accounts: Account[];
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface TransactionFormData extends Omit<Partial<Transaction>, 'date'> {
  date: string;
  transactionType: 'income' | 'expense';
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  categories,
  accounts,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
    paymentMethod: 'Karta debetowa',
    description: '',
    transactionType: 'expense'
  });

  useEffect(() => {
    if (transaction) {
      const formattedDate = new Date(transaction.date).toISOString().split('T')[0];
      const transactionType = transaction.amount >= 0 ? 'income' : 'expense';
      
      setFormData({
        ...transaction,
        date: formattedDate,
        categoryId: transaction.category?.id || '',
        accountId: transaction.account?.id || '',
        transactionType
      } as TransactionFormData);
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'transactionType') {
      // Przy zmianie typu transakcji, resetujemy wybraną kategorię
      setFormData({ 
        ...formData, 
        [name]: value as 'income' | 'expense', 
        categoryId: '',
        // Ustawiamy kwotę jako dodatnią dla przychodu, ujemną dla wydatku
        amount: value === 'income' ? Math.abs(formData.amount || 0) : -Math.abs(formData.amount || 0)
      });
    } else if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      // Ustawiamy kwotę jako dodatnią dla przychodu, ujemną dla wydatku
      const amount = formData.transactionType === 'income' ? Math.abs(numValue) : -Math.abs(numValue);
      setFormData({ ...formData, amount });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tworzymy nowy obiekt bez pola transactionType
    const { title, amount, date, categoryId, accountId, paymentMethod, description } = formData;
    
    const submissionData = {
      title,
      amount,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      categoryId,
      accountId,
      paymentMethod,
      description
    };
    
    onSubmit(submissionData);
  };

  // Filtrujemy kategorie na podstawie wybranego typu transakcji
  const filteredCategories = categories.filter(
    category => category.isIncome === (formData.transactionType === 'income')
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Nazwa transakcji
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">
            Typ transakcji
          </label>
          <select
            id="transactionType"
            name="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="income">Przychód</option>
            <option value="expense">Wydatek</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Kwota
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">zł</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={Math.abs(formData.amount || 0)}
              onChange={handleChange}
              step="0.01"
              required
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={`text-sm ${formData.transactionType === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {formData.transactionType === 'income' ? '+' : '-'}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formData.transactionType === 'income' ? 'Przychód' : 'Wydatek'}: {formatCurrency(formData.amount || 0)}
          </p>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Kategoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Wybierz kategorię</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {filteredCategories.length === 0 && (
            <p className="mt-1 text-sm text-red-500">
              Brak dostępnych kategorii dla wybranego typu transakcji. Dodaj kategorie w ustawieniach.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
            Konto
          </label>
          <select
            id="accountId"
            name="accountId"
            value={formData.accountId || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Wybierz konto</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({formatCurrency(account.balance)})
              </option>
            ))}
          </select>
          {accounts.length === 0 && (
            <p className="mt-1 text-sm text-red-500">
              Brak dostępnych kont. Dodaj konto w ustawieniach.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Metoda płatności
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Karta debetowa">Karta debetowa</option>
            <option value="Karta kredytowa">Karta kredytowa</option>
            <option value="Gotówka">Gotówka</option>
            <option value="Przelew">Przelew</option>
            <option value="BLIK">BLIK</option>
            <option value="Inne">Inne</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Opis (opcjonalnie)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Zapisywanie...' : transaction ? 'Aktualizuj' : 'Dodaj'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
