import React from 'react';

export default function Security() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Ustawienia bezpieczeństwa</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Zmiana hasła</h3>
          
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Aktualne hasło
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nowe hasło
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hasło powinno zawierać co najmniej 8 znaków, w tym wielkie i małe litery, cyfry oraz znaki specjalne.
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Potwierdź nowe hasło
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Zmień hasło
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Weryfikacja dwuetapowa</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Weryfikacja dwuetapowa</p>
              <p className="text-xs text-gray-500">Dodatkowa warstwa zabezpieczeń dla Twojego konta</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="pl-4 border-l-2 border-gray-200">
            <p className="text-sm text-gray-600">
              Weryfikacja dwuetapowa wymaga podania kodu z aplikacji uwierzytelniającej lub wiadomości SMS przy każdym logowaniu.
              To znacznie zwiększa bezpieczeństwo Twojego konta, nawet jeśli Twoje hasło zostanie przejęte.
            </p>
            <button className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-700">
              Skonfiguruj weryfikację dwuetapową
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Sesje i urządzenia</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Windows 11 - Chrome</p>
                    <p className="text-xs text-gray-500">Warszawa, Polska • Aktywna teraz</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Bieżąca</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">iPhone 13 - Safari</p>
                    <p className="text-xs text-gray-500">Warszawa, Polska • Ostatnio: 2 godziny temu</p>
                  </div>
                  <button className="text-xs text-red-600 hover:text-red-800">Wyloguj</button>
                </div>
              </div>
            </div>
          </div>
          
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
            Wyloguj ze wszystkich urządzeń
          </button>
        </div>
      </div>
    </div>
  );
};