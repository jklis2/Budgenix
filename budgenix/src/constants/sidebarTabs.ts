import { IconType } from "react-icons";
import { 
  MdDashboard, 
  MdAccountBalance, 
  MdAccountBalanceWallet,
  MdCategory,
  MdReceipt,
  MdSubscriptions,
  MdSavings,
  MdBarChart
} from "react-icons/md";

export interface SidebarTab {
  label: string;
  path: string;
  icon: IconType;
}

export const sidebarTabs: SidebarTab[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: MdDashboard
  },
  {
    label: "Konta",
    path: "/dashboard/accounts",
    icon: MdAccountBalance
  },
  {
    label: "Budżet",
    path: "/dashboard/budget",
    icon: MdAccountBalanceWallet
  },
  {
    label: "Kategorie",
    path: "/dashboard/categories",
    icon: MdCategory
  },
  {
    label: "Transakcje",
    path: "/dashboard/transactions",
    icon: MdReceipt
  },
  {
    label: "Subskrypcje",
    path: "/dashboard/subscriptions",
    icon: MdSubscriptions
  },
  {
    label: "Cele oszczędnościowe",
    path: "/dashboard/savings-goals",
    icon: MdSavings
  },
  {
    label: "Raporty i analizy",
    path: "/dashboard/reports-and-analytics",
    icon: MdBarChart
  }
];