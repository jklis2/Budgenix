"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarTabs } from "@/constants/sidebarTabs";
import { formatCurrency } from "@/constants/accountsData";
import { buildApiUrl } from '@/lib/utils/apiUrl';

interface MainSidebarProps {
  isOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function MainSidebar({ isOpen = true, isMobile = false, onClose }: MainSidebarProps) {
  const pathname = usePathname();
  const [totalBalance, setTotalBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await fetch(buildApiUrl("/api/accounts"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const accounts = await response.json();
        if (Array.isArray(accounts)) {
          const sum = accounts.reduce(
            (acc: number, account: { balance: number }) => acc + (account.balance || 0),
            0
          );
          setTotalBalance(sum);
        }
      } catch (error) {
        console.error("Failed to fetch accounts for sidebar balance:", error);
      }
    };

    fetchTotalBalance();

    const handleAccountsUpdated = () => {
      fetchTotalBalance();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("accountsUpdated", handleAccountsUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("accountsUpdated", handleAccountsUpdated);
      }
    };
  }, []);

  return (
    <aside className={`bg-gradient-to-b from-indigo-900 to-indigo-800 text-white fixed top-0 left-0 shadow-xl transition-all duration-300 ease-in-out transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${
      isMobile ? 'w-full h-screen z-50' : 'w-64 h-screen z-50 lg:z-30'
    } flex flex-col`}>
      {/* Header z logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Budgenix</span>
        </div>
        
        {/* Close button for mobile */}
        {isMobile && onClose && (
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-indigo-700/50 transition-colors lg:hidden"
            aria-label="Zamknij menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Sekcja balansu */}
      <div className="px-4 mt-6">
        <div className="bg-indigo-700/30 rounded-lg p-3 mb-6">
          <div className="text-xs text-indigo-200 uppercase font-semibold mb-1">Twój balans</div>
          <div className="text-2xl font-bold">
            {totalBalance !== null ? formatCurrency(totalBalance, "PLN") : "-"}
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Oszczędzaj więcej
          </div>
        </div>
      </div>
      
      {/* Menu */}
      <div className="px-3 overflow-y-auto">
        <div className="text-xs text-indigo-300 uppercase font-semibold px-4 mb-2">Menu</div>
        <ul className="space-y-0.5">
          {sidebarTabs.map((tab) => {
            const isActive = pathname === tab.path || 
                           (tab.path !== '/dashboard' && pathname?.startsWith(tab.path));
            const Icon = tab.icon;
            
            return (
              <li key={tab.path}>
                <Link 
                  href={tab.path} 
                  className={`group flex items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-700 to-indigo-600 text-white font-medium shadow-lg' 
                      : 'text-indigo-100 hover:bg-indigo-700/50 hover:translate-x-1'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-2.5 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 shadow-inner' 
                      : 'bg-indigo-800/50 group-hover:bg-indigo-700/70 group-hover:scale-110'
                  }`}>
                    <Icon 
                      className={`w-4 h-4 transition-all duration-200 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-indigo-200 group-hover:text-white'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
