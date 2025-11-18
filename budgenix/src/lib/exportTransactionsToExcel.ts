import * as XLSX from 'xlsx';
import { Transaction } from '@/lib/services/transactionService';

export const exportTransactionsToExcel = (transactions: Transaction[]) => {
  if (!transactions || transactions.length === 0) {
    return;
  }

  // Dane w uporządkowanej kolejności kolumn
  const headers = [
    'Data',
    'Nazwa',
    'Kategoria',
    'Konto',
    'Typ',
    'Kwota',
    'Metoda płatności',
    'Opis',
  ];

  const rows = transactions.map((tx) => ([
    new Date(tx.date).toLocaleDateString('pl-PL'),          // Data
    tx.title,                                              // Nazwa
    tx.category?.name || '',                               // Kategoria
    tx.account?.name || '',                                // Konto
    tx.amount >= 0 ? 'Przychód' : 'Wydatek',               // Typ
    Number(tx.amount),                                     // Kwota (liczba)
    tx.paymentMethod,                                      // Metoda płatności
    tx.description || '',                                  // Opis
  ]));

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Ustawienia szerokości kolumn (bardziej "excelowe" UI)
  worksheet['!cols'] = [
    { wch: 12 }, // Data
    { wch: 30 }, // Nazwa
    { wch: 18 }, // Kategoria
    { wch: 20 }, // Konto
    { wch: 12 }, // Typ
    { wch: 14 }, // Kwota
    { wch: 20 }, // Metoda płatności
    { wch: 40 }, // Opis
  ];

  // Format liczbowy dla kolumny "Kwota" (kolumna F)
  const firstDataRow = 2; // wiersz po nagłówkach (1-indexed)
  const lastDataRow = rows.length + 1;
  for (let row = firstDataRow; row <= lastDataRow; row++) {
    const cellRef = `F${row}`;
    const cell = worksheet[cellRef];
    if (cell && typeof cell.v === 'number') {
      // Podstawowy format walutowy – Excel sam dopasuje symbol waluty wg ustawień
      cell.z = '#,##0.00';
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transakcje');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  link.download = `transakcje_${dateStr}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
