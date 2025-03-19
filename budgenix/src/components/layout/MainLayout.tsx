"use client";
import { useState } from "react";
import MainNavbar from "./MainNavbar";
import MainSidebar from "./MainSidebar";
import MainFooter from "./MainFooter";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <MainSidebar isOpen={isSidebarOpen} />
        <main className="p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-180px)]">
            {children}
          </div>
        </main>
      </div>
      <MainFooter isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
