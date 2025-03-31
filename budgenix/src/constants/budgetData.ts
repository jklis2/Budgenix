// Dane dla strony budżetu
// W przyszłości te dane będą pobierane z bazy danych

export const budgetSummaryData = {
  currentMonth: "Marzec 2025",
  totalBudget: 10000,
  spentAmount: 5200.25,
  remainingAmount: 4799.75, // totalBudget - spentAmount
  spentPercentage: 52 // Math.round((spentAmount / totalBudget) * 100)
};

export const budgetCategories = [
  { id: 1, name: 'Mieszkanie', allocated: 3000, spent: 2800, color: 'indigo' },
  { id: 2, name: 'Żywność', allocated: 2000, spent: 1450, color: 'emerald' },
  { id: 3, name: 'Transport', allocated: 1000, spent: 420, color: 'blue' },
  { id: 4, name: 'Rozrywka', allocated: 800, spent: 350, color: 'purple' },
  { id: 5, name: 'Subskrypcje', allocated: 200, spent: 180, color: 'amber' },
  { id: 6, name: 'Oszczędności', allocated: 3000, spent: 0, color: 'green' },
];

export const budgetActionsData = [
  {
    id: 1,
    title: 'Dostosuj budżet',
    description: 'Dostosuj swój budżet do zmieniających się potrzeb i celów finansowych',
    buttonText: 'Edytuj budżet',
    gradientFrom: 'indigo-600',
    gradientTo: 'indigo-800',
    textColor: 'text-indigo-200',
    icon: 'adjust'
  },
  {
    id: 2,
    title: 'Raport budżetu',
    description: 'Generuj szczegółowy raport z wydatków i oszczędności w tym miesiącu',
    buttonText: 'Generuj raport',
    gradientFrom: 'emerald-600',
    gradientTo: 'emerald-800',
    textColor: 'text-emerald-200',
    icon: 'report'
  }
];

export const budgetTip = {
  title: 'Wskazówka budżetowa',
  content: 'Spróbuj zastosować regułę 50/30/20 w swoim budżecie: 50% na potrzeby, 30% na zachcianki i 20% na oszczędności. To pomoże Ci zrównoważyć wydatki i systematycznie budować oszczędności.'
};
