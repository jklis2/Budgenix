"use client";
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  // Funkcja renderująca ustawienia profilu
  const renderProfileSettings = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Ustawienia profilu</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors mb-2">
                Zmień zdjęcie
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Usuń zdjęcie
              </button>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Jan Kowalski"
                  defaultValue="Jan Kowalski"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adres e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="jan.kowalski@example.com"
                  defaultValue="jan.kowalski@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Numer telefonu
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+48 123 456 789"
                  defaultValue="+48 123 456 789"
                />
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Waluta domyślna
                </label>
                <select
                  id="currency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue="PLN"
                >
                  <option value="PLN">Polski złoty (PLN)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dolar amerykański (USD)</option>
                  <option value="GBP">Funt brytyjski (GBP)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Język
                </label>
                <select
                  id="language"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue="pl"
                >
                  <option value="pl">Polski</option>
                  <option value="en">Angielski</option>
                  <option value="de">Niemiecki</option>
                  <option value="fr">Francuski</option>
                </select>
              </div>
              
              <div className="pt-4">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Zapisz zmiany
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Funkcja renderująca ustawienia powiadomień
  const renderNotificationSettings = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Ustawienia powiadomień</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">Powiadomienia e-mail</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Raporty tygodniowe</p>
                  <p className="text-xs text-gray-500">Otrzymuj cotygodniowe podsumowanie swoich finansów</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Alerty budżetowe</p>
                  <p className="text-xs text-gray-500">Powiadomienia gdy zbliżasz się do limitu budżetu</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Nadchodzące płatności</p>
                  <p className="text-xs text-gray-500">Przypomnienia o zbliżających się płatnościach i subskrypcjach</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Osiągnięcia celów</p>
                  <p className="text-xs text-gray-500">Powiadomienia o osiągnięciu celów oszczędnościowych</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Powiadomienia aplikacji</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Powiadomienia push</p>
                  <p className="text-xs text-gray-500">Włącz powiadomienia push w aplikacji mobilnej</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Dźwięki powiadomień</p>
                  <p className="text-xs text-gray-500">Włącz dźwięki dla powiadomień</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Funkcja renderująca ustawienia bezpieczeństwa
  const renderSecuritySettings = () => {
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

  // Funkcja renderująca ustawienia wyglądu
  const renderAppearanceSettings = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Ustawienia wyglądu</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">Motyw</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-indigo-500 rounded-lg p-4 bg-white relative">
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="h-24 bg-gray-100 rounded mb-3 overflow-hidden">
                  <div className="h-6 bg-white border-b border-gray-200"></div>
                  <div className="p-2">
                    <div className="h-3 w-1/2 bg-indigo-500 rounded mb-2"></div>
                    <div className="h-3 w-3/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-center">Jasny</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-500 transition-colors">
                <div className="h-24 bg-gray-800 rounded mb-3 overflow-hidden">
                  <div className="h-6 bg-gray-900 border-b border-gray-700"></div>
                  <div className="p-2">
                    <div className="h-3 w-1/2 bg-indigo-500 rounded mb-2"></div>
                    <div className="h-3 w-3/4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-gray-600 rounded"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-center">Ciemny</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-500 transition-colors">
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded mb-3 overflow-hidden">
                  <div className="h-6 bg-white/10 border-b border-white/20"></div>
                  <div className="p-2">
                    <div className="h-3 w-1/2 bg-white rounded mb-2"></div>
                    <div className="h-3 w-3/4 bg-white/50 rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-white/50 rounded"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-center">Kolorowy</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Kolor akcentu</h3>
            
            <div className="flex flex-wrap gap-3">
              <button className="w-8 h-8 rounded-full bg-indigo-500 ring-2 ring-offset-2 ring-indigo-500"></button>
              <button className="w-8 h-8 rounded-full bg-blue-500 hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"></button>
              <button className="w-8 h-8 rounded-full bg-emerald-500 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-500 transition-all"></button>
              <button className="w-8 h-8 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-2 hover:ring-amber-500 transition-all"></button>
              <button className="w-8 h-8 rounded-full bg-red-500 hover:ring-2 hover:ring-offset-2 hover:ring-red-500 transition-all"></button>
              <button className="w-8 h-8 rounded-full bg-purple-500 hover:ring-2 hover:ring-offset-2 hover:ring-purple-500 transition-all"></button>
              <button className="w-8 h-8 rounded-full bg-pink-500 hover:ring-2 hover:ring-offset-2 hover:ring-pink-500 transition-all"></button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Układ dashboardu</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-indigo-500 rounded-lg p-4 bg-white relative">
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="h-24 bg-gray-100 rounded mb-3 overflow-hidden flex">
                  <div className="w-1/5 h-full bg-gray-200 border-r border-gray-300"></div>
                  <div className="flex-1 p-2">
                    <div className="h-3 w-1/2 bg-gray-300 rounded mb-2"></div>
                    <div className="h-10 bg-white rounded border border-gray-300 mb-2"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-center">Standardowy</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-500 transition-colors">
                <div className="h-24 bg-gray-100 rounded mb-3 overflow-hidden flex">
                  <div className="w-1/5 h-full bg-gray-200 border-r border-gray-300"></div>
                  <div className="flex-1 p-2 flex flex-col">
                    <div className="h-3 w-1/2 bg-gray-300 rounded mb-2"></div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="bg-white rounded border border-gray-300"></div>
                      <div className="bg-white rounded border border-gray-300"></div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-center">Kompaktowy</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Czcionka</h3>
            
            <div>
              <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                Rozmiar czcionki
              </label>
              <select
                id="fontSize"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="medium"
              >
                <option value="small">Mały</option>
                <option value="medium">Średni</option>
                <option value="large">Duży</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Funkcja renderująca ustawienia preferencji
  const renderPreferencesSettings = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Preferencje</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">Ogólne</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Automatyczne logowanie</p>
                  <p className="text-xs text-gray-500">Pozostań zalogowany po zamknięciu przeglądarki</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Potwierdzenia transakcji</p>
                  <p className="text-xs text-gray-500">Wymagaj potwierdzenia przed każdą transakcją</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Strona startowa</h3>
            
            <div>
              <label htmlFor="startPage" className="block text-sm font-medium text-gray-700 mb-1">
                Po zalogowaniu pokazuj
              </label>
              <select
                id="startPage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="dashboard"
              >
                <option value="dashboard">Pulpit główny</option>
                <option value="transactions">Transakcje</option>
                <option value="budget">Budżet</option>
                <option value="goals">Cele oszczędnościowe</option>
                <option value="reports">Raporty i analityka</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Eksport danych</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Domyślny format eksportu
                </label>
                <select
                  id="exportFormat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue="csv"
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="pdf">PDF</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Uwzględnij metadane</p>
                  <p className="text-xs text-gray-500">Dodaj szczegółowe informacje o transakcjach</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Prywatność</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Udostępnianie danych analitycznych</p>
                  <p className="text-xs text-gray-500">Pomóż nam ulepszać aplikację</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Personalizowane sugestie</p>
                  <p className="text-xs text-gray-500">Otrzymuj spersonalizowane porady finansowe</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Funkcja do renderowania odpowiedniej zakładki
  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'preferences':
        return renderPreferencesSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Ustawienia</h1>
        <p className="text-gray-500 mt-1">Dostosuj aplikację do swoich potrzeb</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'notifications' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('notifications')}
        >
          Powiadomienia
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'security' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('security')}
        >
          Bezpieczeństwo
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'appearance' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('appearance')}
        >
          Wygląd
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'preferences' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferencje
        </button>
      </div>
      
      {/* Tab content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
}