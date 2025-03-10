"use client";
import { useState } from "react";
import MainNavbar from "./MainNavbar";
import MainSidebar from "./MainSidebar";
import MainFooter from "./MainFooter";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-grow">
        {isSidebarOpen && <MainSidebar />}
        <main className={`flex-grow p-6 transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          {children}
        </main>
      </div>
      <MainFooter isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
