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
      <div className={`flex-grow transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <MainSidebar isOpen={isSidebarOpen} />
        <main className="pt-6 pl-14">
          {children}
        </main>
      </div>
      <MainFooter isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
