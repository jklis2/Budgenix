// Dane dla strony kategorii
// W przyszłości te dane będą pobierane z bazy danych

export const categoriesData = [
  { id: 1, name: 'Mieszkanie', icon: '🏠', color: 'indigo', budget: 3000, spent: 2800, transactions: 5 },
  { id: 2, name: 'Żywność', icon: '🍎', color: 'emerald', budget: 2000, spent: 1450, transactions: 12 },
  { id: 3, name: 'Transport', icon: '🚗', color: 'blue', budget: 1000, spent: 420, transactions: 8 },
  { id: 4, name: 'Rozrywka', icon: '🎬', color: 'purple', budget: 800, spent: 350, transactions: 4 },
  { id: 5, name: 'Subskrypcje', icon: '📱', color: 'amber', budget: 200, spent: 180, transactions: 3 },
  { id: 6, name: 'Oszczędności', icon: '💰', color: 'green', budget: 3000, spent: 0, transactions: 1 },
  { id: 7, name: 'Rachunki', icon: '📄', color: 'red', budget: 1200, spent: 980, transactions: 6 },
  { id: 8, name: 'Zdrowie', icon: '⚕️', color: 'teal', budget: 500, spent: 120, transactions: 2 },
];

export const categoriesStats = {
  totalCategories: 8,
  totalBudget: 11700, // Suma wszystkich budżetów
  totalSpent: 6300, // Suma wszystkich wydatków
  totalTransactions: 41 // Suma wszystkich transakcji
};
