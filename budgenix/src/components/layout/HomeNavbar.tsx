"use client"
import Link from "next/link";
import { useState } from "react";

export default function HomeNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-bold text-gray-800">Budgenix</span>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Strona główna
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              O nas
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Kontakt
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition-colors"
            >
              Zaloguj się
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 border border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors"
            >
              Zarejestruj się
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="flex flex-col space-y-3 px-4 pt-2 pb-4">
            <Link href="/" className="text-gray-600 hover:text-teal-600 font-medium py-2 transition-colors">
              Strona główna
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-teal-600 font-medium py-2 transition-colors">
              O nas
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-teal-600 font-medium py-2 transition-colors">
              Kontakt
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition-colors text-center mt-2"
            >
              Zaloguj się
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 border border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors text-center"
            >
              Zarejestruj się
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
