export interface SidebarTab {
  label: string;
  path: string;
  iconPath: string;
}

export const sidebarTabs: SidebarTab[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    iconPath: "/icons/dashboard.svg"
  },
  {
    label: "Konta",
    path: "/dashboard/accounts",
    iconPath: "/icons/budget.svg"
  },
  {
    label: "Budżet",
    path: "/dashboard/budget",
    iconPath: "/icons/budget.svg"
  },
  {
    label: "Kategorie",
    path: "/dashboard/categories",
    iconPath: "/icons/categories.svg"
  },
  {
    label: "Transakcje",
    path: "/dashboard/transactions",
    iconPath: "/icons/transactions.svg"
  },
  {
    label: "Subskrypcje",
    path: "/dashboard/subscriptions",
    iconPath: "/icons/subscriptions.svg"
  },
  {
    label: "Cele oszczędnościowe",
    path: "/dashboard/savings-goals",
    iconPath: "/icons/savingsGoals.svg"
  },
  {
    label: "Raporty i analizy",
    path: "/dashboard/reports-and-analytics",
    iconPath: "/icons/reportsAndAnalytics.svg"
  }
];