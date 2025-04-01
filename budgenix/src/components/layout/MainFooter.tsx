import Link from "next/link";

export default function MainFooter({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-white border-t border-gray-200 py-4 px-6 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-3 md:mb-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">Budgenix</span>
        </div>
        
        <div className="text-xs text-gray-500">
          {currentYear} Budgenix. Wszelkie prawa zastrzeżone.
        </div>
        
        <div className="flex space-x-4 mt-3 md:mt-0">
          <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-indigo-600 transition-colors">
            Polityka prywatności
          </Link>
          <Link href="/terms" className="text-xs text-gray-600 hover:text-indigo-600 transition-colors">
            Warunki użytkowania
          </Link>
        </div>
      </div>
    </footer>
  );
}
