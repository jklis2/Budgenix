// Transaction data for the transactions page
// This simulates data that would come from a database
import React from 'react';

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
}

export const transactions: Transaction[] = [
  { id: 1, title: 'Zakupy spożywcze', amount: -245.50, date: '2025-03-18', category: 'Żywność', paymentMethod: 'Karta debetowa' },
  { id: 2, title: 'Wynagrodzenie', amount: 8500, date: '2025-03-15', category: 'Przychód', paymentMethod: 'Przelew' },
  { id: 3, title: 'Netflix', amount: -49, date: '2025-03-12', category: 'Subskrypcje', paymentMethod: 'Karta kredytowa' },
  { id: 4, title: 'Paliwo', amount: -320, date: '2025-03-10', category: 'Transport', paymentMethod: 'Karta debetowa' },
  { id: 5, title: 'Restauracja', amount: -180, date: '2025-03-08', category: 'Rozrywka', paymentMethod: 'Gotówka' },
  { id: 6, title: 'Czynsz', amount: -1800, date: '2025-03-05', category: 'Mieszkanie', paymentMethod: 'Przelew' },
  { id: 7, title: 'Sprzedaż na Allegro', amount: 350, date: '2025-03-03', category: 'Przychód', paymentMethod: 'Przelew' },
  { id: 8, title: 'Rachunek za prąd', amount: -220, date: '2025-03-02', category: 'Rachunki', paymentMethod: 'Przelew' },
];

export interface TransactionSummaryCardProps {
  title: string;
  amount: string;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export interface TipCardData {
  title: string;
  description: string;
  icon: string;
  bgColorClass: string;
  borderColorClass: string;
  textColorClass: string;
  descriptionColorClass: string;
  actions: { label: string; onClick: () => void }[];
}

export const transactionTips: TipCardData[] = [
  {
    title: "Eksportuj transakcje",
    description: "Pobierz historię transakcji w wybranym formacie",
    icon: "download", 
    bgColorClass: "bg-indigo-50",
    borderColorClass: "border-indigo-100",
    textColorClass: "text-indigo-900",
    descriptionColorClass: "text-indigo-800",
    actions: [
      { label: "CSV", onClick: () => console.log("Export CSV") },
      { label: "PDF", onClick: () => console.log("Export PDF") },
      { label: "Excel", onClick: () => console.log("Export Excel") }
    ]
  }
];
