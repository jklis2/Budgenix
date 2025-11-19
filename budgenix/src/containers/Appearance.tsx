import React from 'react';

export default function Appearance() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Ustawienia wyglądu</h2>
      
      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-800">
              Zmiany związane z wyglądem będą dostępne wkrótce.
            </p>
            <p className="text-[10px] sm:text-xs text-blue-700 mt-1">
              Pracujemy nad implementacją motywów i personalizacji interfejsu.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 opacity-50 pointer-events-none">
        <div>
          <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-3 sm:mb-4">Motyw</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="border border-indigo-500 rounded-lg p-3 sm:p-4 bg-white relative">
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
              <p className="text-xs sm:text-sm font-medium text-center">Jasny</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white hover:border-indigo-500 transition-colors">
              <div className="h-24 bg-gray-800 rounded mb-3 overflow-hidden">
                <div className="h-6 bg-gray-900 border-b border-gray-700"></div>
                <div className="p-2">
                  <div className="h-3 w-1/2 bg-indigo-500 rounded mb-2"></div>
                  <div className="h-3 w-3/4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 w-1/3 bg-gray-600 rounded"></div>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-center">Ciemny</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white hover:border-indigo-500 transition-colors">
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded mb-3 overflow-hidden">
                <div className="h-6 bg-white/10 border-b border-white/20"></div>
                <div className="p-2">
                  <div className="h-3 w-1/2 bg-white rounded mb-2"></div>
                  <div className="h-3 w-3/4 bg-white/70 rounded mb-2"></div>
                  <div className="h-3 w-1/3 bg-white/70 rounded"></div>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-center">Kolorowy</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 sm:pt-6">
          <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-3 sm:mb-4">Kolor akcentu</h3>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button className="w-8 h-8 rounded-full bg-indigo-500 ring-2 ring-offset-2 ring-indigo-500"></button>
            <button className="w-8 h-8 rounded-full bg-blue-500 hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-emerald-500 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-2 hover:ring-amber-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-red-500 hover:ring-2 hover:ring-offset-2 hover:ring-red-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-purple-500 hover:ring-2 hover:ring-offset-2 hover:ring-purple-500 transition-all"></button>
            <button className="w-8 h-8 rounded-full bg-pink-500 hover:ring-2 hover:ring-offset-2 hover:ring-pink-500 transition-all"></button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 sm:pt-6">
          <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-3 sm:mb-4">Czcionka</h3>
          
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
          <button disabled className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-not-allowed">
            Zapisz zmiany
          </button>
        </div>
      </div>
    </div>
  );
};