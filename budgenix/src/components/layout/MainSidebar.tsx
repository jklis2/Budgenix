"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sidebarTabs } from "@/constants/sidebarTabs";

interface MainSidebarProps {
  isOpen?: boolean;
}

export default function MainSidebar({ isOpen = true }: MainSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`bg-gradient-to-b from-indigo-900 to-indigo-800 text-white w-64 h-screen fixed top-0 left-0 shadow-xl transition-all duration-300 ease-in-out transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } z-50 flex flex-col`}>
      {/* Header z logo */}
      <div className="h-16 flex items-center justify-center border-b border-indigo-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Budgenix</span>
        </div>
      </div>
      
      {/* Sekcja balansu */}
      <div className="px-4 mt-6">
        <div className="bg-indigo-700/30 rounded-lg p-3 mb-6">
          <div className="text-xs text-indigo-200 uppercase font-semibold mb-1">Twój balans</div>
          <div className="text-2xl font-bold">0,00 zł</div>
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
        <ul className="space-y-1">
          {sidebarTabs.map((tab) => {
            const isActive = pathname === tab.path || 
                           (tab.path !== '/dashboard' && pathname?.startsWith(tab.path));
            
            return (
              <li key={tab.path}>
                <Link 
                  href={tab.path} 
                  className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'text-indigo-100 hover:bg-indigo-700/50'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-md mr-3 ${
                    isActive ? 'bg-indigo-600' : 'bg-indigo-800/50'
                  }`}>
                    <Image 
                      src={tab.iconPath} 
                      alt={`${tab.label} icon`} 
                      width={20} 
                      height={20}
                      className="opacity-90"
                    />
                  </div>
                  <span className="text-sm">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
