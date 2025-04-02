// Utility functions for transactions
import React from 'react';

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

export const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('pl-PL', {
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

// Funkcja do generowania kolorów dla kategorii
export const getCategoryColor = (categoryName: string, isIncome: boolean): string => {
  if (isIncome) {
    return 'bg-emerald-100 text-emerald-800';
  }
  
  // Mapowanie kategorii na kolory
  const categoryColors: Record<string, string> = {
    'Żywność': 'bg-orange-100 text-orange-800',
    'Transport': 'bg-blue-100 text-blue-800',
    'Mieszkanie': 'bg-purple-100 text-purple-800',
    'Rozrywka': 'bg-pink-100 text-pink-800',
    'Subskrypcje': 'bg-indigo-100 text-indigo-800',
    'Rachunki': 'bg-red-100 text-red-800',
    'Zdrowie': 'bg-green-100 text-green-800',
    'Edukacja': 'bg-yellow-100 text-yellow-800',
    'Odzież': 'bg-teal-100 text-teal-800',
    'Inne': 'bg-gray-100 text-gray-800'
  };
  
  return categoryColors[categoryName] || 'bg-gray-100 text-gray-800';
};
