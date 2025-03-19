"use client";
import Link from "next/link";
import Image from "next/image";
import { sidebarTabs } from "@/constants/sidebarTabs";

interface MainSidebarProps {
  isOpen?: boolean;
}

export default function MainSidebar({ isOpen = true }: MainSidebarProps) {
  return (
    <aside className={`bg-green-500 text-white w-72 h-screen fixed top-0 left-0 shadow-lg transition-all duration-300 ease-in-out transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-16 flex items-center justify-center">
        <span className="text-lg font-semibold">Budgenix</span>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2 px-4">
          {sidebarTabs.map((tab) => (
            <li key={tab.path}>
              <Link 
                href={tab.path} 
                className="flex items-center py-2 px-4 hover:bg-green-600 rounded transition-colors cursor-pointer"
              >
                <Image 
                  src={tab.iconPath} 
                  alt={`${tab.label} icon`} 
                  width={40} 
                  height={40} 
                  className="mr-3"
                />
                <span>{tab.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
