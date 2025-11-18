import * as XLSX from 'xlsx';

// Typy danych dla eksportu
export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  periodLabel: string;
  timeStats: Array<{
    period: string;
    income: number;
    expense: number;
    savings: number;
  }>;
  categoryStats: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  budgetComparisons: Array<{
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
  }>;
}

/**
 * Formatuje datę dla nazwy pliku
 */
const getFileTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Formatuje kwotę w PLN dla wszystkich eksportów
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Formatuje kwotę dla PDF - używa formatCurrency który ma polskie zł
 */
const formatCurrencyForPDF = (amount: number): string => {
  return formatCurrency(amount);
};

/**
 * Eksportuje raport do formatu Excel
 */
export const exportToExcel = (data: ReportData) => {
  if (!data) {
    console.error('Brak danych do eksportu');
    return;
  }

  const workbook = XLSX.utils.book_new();

  // Arkusz 1: Podsumowanie
  const summaryData = [
    ['RAPORT FINANSOWY'],
    ['Okres:', data.periodLabel],
    ['Data wygenerowania:', new Date().toLocaleDateString('pl-PL')],
    [],
    ['PODSUMOWANIE'],
    ['Przychody:', Number(data.totalIncome)],
    ['Wydatki:', Number(data.totalExpenses)],
    ['Oszczędności:', Number(data.totalSavings)],
    ['Stopa oszczędności:', `${data.savingsRate}%`],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { wch: 25 },
    { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Podsumowanie');

  // Arkusz 2: Trendy w czasie
  if (data.timeStats && data.timeStats.length > 0) {
    const timeHeaders = ['Okres', 'Przychody', 'Wydatki', 'Oszczędności'];
    const timeRows = data.timeStats.map(item => [
      item.period,
      Number(item.income),
      Number(item.expense),
      Number(item.savings)
    ]);

    const timeSheet = XLSX.utils.aoa_to_sheet([timeHeaders, ...timeRows]);
    timeSheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    // Formatowanie liczb jako waluta
    for (let row = 2; row <= timeRows.length + 1; row++) {
      for (const col of ['B', 'C', 'D']) {
        const cellRef = `${col}${row}`;
        if (timeSheet[cellRef] && typeof timeSheet[cellRef].v === 'number') {
          timeSheet[cellRef].z = '#,##0.00';
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, timeSheet, 'Trendy czasowe');
  }

  // Arkusz 3: Kategorie wydatków
  if (data.categoryStats && data.categoryStats.length > 0) {
    const categoryHeaders = ['Kategoria', 'Kwota', 'Procent'];
    const categoryRows = data.categoryStats.map(item => [
      item.name,
      Number(item.amount),
      `${item.percentage}%`
    ]);

    const categorySheet = XLSX.utils.aoa_to_sheet([categoryHeaders, ...categoryRows]);
    categorySheet['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 12 }
    ];

    // Formatowanie kwot
    for (let row = 2; row <= categoryRows.length + 1; row++) {
      const cellRef = `B${row}`;
      if (categorySheet[cellRef] && typeof categorySheet[cellRef].v === 'number') {
        categorySheet[cellRef].z = '#,##0.00';
      }
    }

    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Kategorie');
  }

  // Arkusz 4: Budżet vs Rzeczywistość
  if (data.budgetComparisons && data.budgetComparisons.length > 0) {
    const budgetHeaders = ['Kategoria', 'Budżet', 'Rzeczywiste', 'Różnica'];
    const budgetRows = data.budgetComparisons.map(item => [
      item.category,
      Number(item.budgeted),
      Number(item.actual),
      Number(item.variance)
    ]);

    const budgetSheet = XLSX.utils.aoa_to_sheet([budgetHeaders, ...budgetRows]);
    budgetSheet['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    // Formatowanie kwot
    for (let row = 2; row <= budgetRows.length + 1; row++) {
      for (const col of ['B', 'C', 'D']) {
        const cellRef = `${col}${row}`;
        if (budgetSheet[cellRef] && typeof budgetSheet[cellRef].v === 'number') {
          budgetSheet[cellRef].z = '#,##0.00';
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Budżet');
  }

  // Generowanie pliku
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `raport_finansowy_${getFileTimestamp()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Eksportuje raport do formatu CSV
 */
export const exportToCSV = (data: ReportData) => {
  if (!data) {
    console.error('Brak danych do eksportu');
    return;
  }

  // Dodanie BOM (Byte Order Mark) dla prawidłowego kodowania UTF-8 w Excelu
  const BOM = '\uFEFF';
  let csvContent = BOM;

  // Nagłówek
  csvContent += 'RAPORT FINANSOWY\n';
  csvContent += `Okres,${data.periodLabel}\n`;
  csvContent += `Data wygenerowania,${new Date().toLocaleDateString('pl-PL')}\n\n`;

  // Podsumowanie
  csvContent += 'PODSUMOWANIE\n';
  csvContent += `Przychody,${data.totalIncome}\n`;
  csvContent += `Wydatki,${data.totalExpenses}\n`;
  csvContent += `Oszczędności,${data.totalSavings}\n`;
  csvContent += `Stopa oszczędności,${data.savingsRate}%\n\n`;

  // Trendy czasowe
  if (data.timeStats && data.timeStats.length > 0) {
    csvContent += 'TRENDY CZASOWE\n';
    csvContent += 'Okres,Przychody,Wydatki,Oszczędności\n';
    data.timeStats.forEach(item => {
      csvContent += `${item.period},${item.income},${item.expense},${item.savings}\n`;
    });
    csvContent += '\n';
  }

  // Kategorie
  if (data.categoryStats && data.categoryStats.length > 0) {
    csvContent += 'KATEGORIE WYDATKÓW\n';
    csvContent += 'Kategoria,Kwota,Procent\n';
    data.categoryStats.forEach(item => {
      csvContent += `${item.name},${item.amount},${item.percentage}%\n`;
    });
    csvContent += '\n';
  }

  // Budżet
  if (data.budgetComparisons && data.budgetComparisons.length > 0) {
    csvContent += 'BUDŻET VS RZECZYWISTOŚĆ\n';
    csvContent += 'Kategoria,Budżet,Rzeczywiste,Różnica\n';
    data.budgetComparisons.forEach(item => {
      csvContent += `${item.category},${item.budgeted},${item.actual},${item.variance}\n`;
    });
  }

  // Utworzenie i pobranie pliku z BOM dla UTF-8
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `raport_finansowy_${getFileTimestamp()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Eksportuje raport do formatu PDF z PEŁNYMI polskimi znakami
 * Wymaga zainstalowania: npm install pdfmake
 */
export const exportToPDF = async (data: ReportData) => {
  if (!data) {
    console.error('Brak danych do eksportu');
    return;
  }

  try {
    // @ts-expect-error - dynamiczny import bez typów
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    // @ts-expect-error - dynamiczny import bez typów
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    
    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;
    
    if (!pdfMake || !pdfMake.createPdf) {
      throw new Error('pdfMake nie został załadowany poprawnie');
    }
    
    pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

    const primaryColor = '#6366f1';
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docDefinition: any = {
      info: {
        title: `Raport Finansowy - ${data.periodLabel}`,
        author: 'Budgenix'
      },
      pageSize: 'A4',
      pageMargins: [40, 80, 40, 60],
      
      header: {
        margin: [0, 0, 0, 20],
        table: {
          widths: ['*'],
          body: [
            [{ text: 'RAPORT FINANSOWY', fillColor: primaryColor, color: 'white', alignment: 'center', fontSize: 20, bold: true, margin: [0, 15, 0, 5] }],
            [{ text: `Okres: ${data.periodLabel}  |  Data: ${new Date().toLocaleDateString('pl-PL')}`, fillColor: primaryColor, color: 'white', alignment: 'center', fontSize: 10, margin: [0, 0, 0, 15] }]
          ]
        },
        layout: 'noBorders'
      },
      
      footer: (currentPage: number, pageCount: number) => ({
        margin: [40, 0, 40, 20],
        columns: [
          { text: new Date().toLocaleDateString('pl-PL'), alignment: 'left', fontSize: 8, color: '#6b7280' },
          { text: `Strona ${currentPage} z ${pageCount}`, alignment: 'center', fontSize: 8, color: '#6b7280' },
          { text: 'Wygenerowano przez Budgenix', alignment: 'right', fontSize: 8, color: '#6b7280' }
        ]
      }),
      
      content: [
        { text: 'PODSUMOWANIE', fontSize: 14, bold: true, margin: [0, 0, 0, 10], color: '#4b5563' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{ text: 'Metryka', fillColor: primaryColor, color: 'white', bold: true }, { text: 'Wartość', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' }],
              ['Przychody', { text: formatCurrencyForPDF(data.totalIncome), alignment: 'right' }],
              ['Wydatki', { text: formatCurrencyForPDF(data.totalExpenses), alignment: 'right' }],
              ['Oszczędności', { text: formatCurrencyForPDF(data.totalSavings), alignment: 'right' }],
              ['Stopa oszczędności', { text: `${data.savingsRate}%`, alignment: 'right' }]
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? null : (rowIndex % 2 === 0 ? '#f9fafb' : null),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0,
            hLineColor: () => '#e5e7eb'
          },
          margin: [0, 0, 0, 15]
        },
        
        ...(data.timeStats && data.timeStats.length > 0 ? [
          { text: 'TRENDY CZASOWE', fontSize: 14, bold: true, margin: [0, 10, 0, 10], color: '#4b5563', pageBreak: 'before' as const },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*'],
              body: [
                [
                  { text: 'Okres', fillColor: primaryColor, color: 'white', bold: true },
                  { text: 'Przychody', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' },
                  { text: 'Wydatki', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' },
                  { text: 'Oszczędności', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' }
                ],
                ...data.timeStats.map(item => [
                  item.period,
                  { text: formatCurrencyForPDF(item.income), alignment: 'right' },
                  { text: formatCurrencyForPDF(item.expense), alignment: 'right' },
                  { text: formatCurrencyForPDF(item.savings), alignment: 'right' }
                ])
              ]
            },
            layout: {
              fillColor: (rowIndex: number) => rowIndex === 0 ? null : (rowIndex % 2 === 0 ? '#f9fafb' : null),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0,
              hLineColor: () => '#e5e7eb'
            },
            margin: [0, 0, 0, 15]
          }
        ] : []),
        
        ...(data.categoryStats && data.categoryStats.length > 0 ? [
          { text: 'KATEGORIE WYDATKÓW', fontSize: 14, bold: true, margin: [0, 10, 0, 10], color: '#4b5563' },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', 'auto'],
              body: [
                [
                  { text: 'Kategoria', fillColor: primaryColor, color: 'white', bold: true },
                  { text: 'Kwota', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' },
                  { text: 'Procent', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' }
                ],
                ...data.categoryStats.map(item => [
                  item.name,
                  { text: formatCurrencyForPDF(item.amount), alignment: 'right' },
                  { text: `${item.percentage}%`, alignment: 'right' }
                ])
              ]
            },
            layout: {
              fillColor: (rowIndex: number) => rowIndex === 0 ? null : (rowIndex % 2 === 0 ? '#f9fafb' : null),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0,
              hLineColor: () => '#e5e7eb'
            },
            margin: [0, 0, 0, 15]
          }
        ] : []),
        
        ...(data.budgetComparisons && data.budgetComparisons.length > 0 ? [
          { text: 'BUDŻET VS RZECZYWISTOŚĆ', fontSize: 14, bold: true, margin: [0, 10, 0, 10], color: '#4b5563', pageBreak: 'before' as const },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*'],
              body: [
                [
                  { text: 'Kategoria', fillColor: primaryColor, color: 'white', bold: true },
                  { text: 'Budżet', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' },
                  { text: 'Rzeczywiste', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' },
                  { text: 'Różnica', fillColor: primaryColor, color: 'white', bold: true, alignment: 'right' }
                ],
                ...data.budgetComparisons.map(item => [
                  item.category,
                  { text: formatCurrencyForPDF(item.budgeted), alignment: 'right' },
                  { text: formatCurrencyForPDF(item.actual), alignment: 'right' },
                  { 
                    text: formatCurrencyForPDF(item.variance), 
                    alignment: 'right',
                    color: item.variance < 0 ? '#dc2626' : (item.variance > 0 ? '#22c55e' : '#000000'),
                    bold: item.variance !== 0
                  }
                ])
              ]
            },
            layout: {
              fillColor: (rowIndex: number) => rowIndex === 0 ? null : (rowIndex % 2 === 0 ? '#f9fafb' : null),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0,
              hLineColor: () => '#e5e7eb'
            }
          }
        ] : [])
      ],
      
      styles: {
        header: { fontSize: 20, bold: true },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 10] }
      },
      
      defaultStyle: { fontSize: 10 }
    };

    console.log('Tworzenie PDF z pdfMake...');
    pdfMake.createPdf(docDefinition).download(`raport_finansowy_${getFileTimestamp()}.pdf`);
    console.log('PDF wygenerowany pomyślnie');
  } catch (error) {
    console.error('Szczegółowy błąd PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    alert(`Błąd podczas generowania PDF: ${errorMessage}\n\nSprawdź konsolę przeglądarki (F12) aby zobaczyć więcej szczegółów.`);
  }
};

