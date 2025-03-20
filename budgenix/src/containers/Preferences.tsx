import React from 'react';

export default function Preferences() {
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
                <p className="text-sm font-medium text-gray-800">Udostępniaj dane analityczne</p>
                <p className="text-xs text-gray-500">Pomóż nam ulepszać aplikację poprzez anonimowe dane użytkowania</p>
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