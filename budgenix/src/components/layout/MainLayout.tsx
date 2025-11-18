"use client";
import { useState, useEffect } from "react";
import MainNavbar from "./MainNavbar";
import MainSidebar from "./MainSidebar";
import MainFooter from "./MainFooter";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      
      // On desktop, open sidebar by default; on mobile, keep it closed
      if (!mobile) {
        setIsSidebarOpen(prev => prev ? prev : true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainNavbar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />
      
      {/* Main content with responsive margin */}
      <div className={`flex-grow transition-all duration-300 ${
        isSidebarOpen && !isMobile ? "lg:ml-64" : "ml-0"
      }`}>
        <MainSidebar 
          isOpen={isSidebarOpen} 
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {/* Backdrop for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}
        
        <main className="p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 min-h-[calc(100vh-180px)]">
            {children}
          </div>
        </main>
      </div>
      
      <MainFooter 
        isSidebarOpen={isSidebarOpen && !isMobile}
      />
    </div>
  );
}
