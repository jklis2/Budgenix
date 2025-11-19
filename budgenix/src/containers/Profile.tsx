"use client";
import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { getUserProfile, updateUserProfile, User } from '@/services/userService';

type UserToken = {
  id: string;
  email: string;
};

const PRESET_GRADIENTS = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: 'Candy', value: 'linear-gradient(135deg, #ff6b95 0%, #ff9a9e 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { name: 'Fire', value: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Royal', value: 'linear-gradient(135deg, #360033 0%, #0b8793 100%)' },
  { name: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { name: 'Twilight', value: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)' },
  { name: 'Mojito', value: 'linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)' },
  { name: 'Cherry', value: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' },
  { name: 'Cosmic', value: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
  { name: 'Mango', value: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)' },
  { name: 'Vice City', value: 'linear-gradient(135deg, #3494e6 0%, #ec6ead 100%)' },
  { name: 'Dawn', value: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' },
  { name: 'Aqua', value: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)' },
];

export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarColor, setAvatarColor] = useState(PRESET_GRADIENTS[0].value);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({ type: 'error', text: 'Nie jesteś zalogowany' });
          setLoading(false);
          return;
        }

        const decoded = jwtDecode<UserToken>(token);
        setUserId(decoded.id);

        const user = await getUserProfile(decoded.id);
        setUserData(user);
        
        // Set form values from user data
        setFullName(user.fullName || '');
        setPhoneNumber(user.phoneNumber || '');
        setAvatarColor(user.avatarColor || PRESET_GRADIENTS[0].value);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ type: 'error', text: 'Nie udało się pobrać danych użytkownika' });
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      setMessage({ type: 'error', text: 'Brak identyfikatora użytkownika' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const updatedUser = await updateUserProfile(userId, {
        fullName: fullName || undefined,
        phoneNumber: phoneNumber || undefined,
        avatarColor: avatarColor || undefined,
      });

      setUserData(updatedUser);
      setMessage({ type: 'success', text: 'Profil został zaktualizowany pomyślnie!' });
      
      // Dispatch custom event to notify navbar about profile update
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Nie udało się zaktualizować profilu' });
    } finally {
      setSaving(false);
    }
  };

  const getAvatarInitial = () => {
    if (fullName) {
      return fullName.charAt(0).toUpperCase();
    }
    if (userData?.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Ładowanie...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Ustawienia profilu</h2>
      
      {message && (
        <div className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <div 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg"
              style={{ background: avatarColor }}
            >
              <span className="text-white text-4xl sm:text-5xl font-semibold drop-shadow-md">
                {getAvatarInitial()}
              </span>
            </div>
            
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1.5 sm:gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              {showColorPicker ? 'Ukryj kolory' : 'Zmień kolor awatara'}
            </button>
            
            {showColorPicker && (
              <div className="w-full max-w-sm animate-fadeIn">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">Wybierz gradient</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {PRESET_GRADIENTS.map((gradient) => (
                      <button
                        key={gradient.value}
                        onClick={() => {
                          setAvatarColor(gradient.value);
                          setShowColorPicker(false);
                        }}
                        className={`relative w-full h-12 sm:h-16 rounded-lg transition-all hover:scale-105 hover:shadow-xl ${
                          avatarColor === gradient.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-xl' : 'shadow-md'
                        }`}
                        style={{ background: gradient.value }}
                        title={gradient.name}
                        aria-label={`Wybierz gradient ${gradient.name}`}
                      >
                        {avatarColor === gradient.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">{PRESET_GRADIENTS.find(g => g.value === avatarColor)?.name || 'Niestandardowy'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Imię i nazwisko
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Jan Kowalski"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Adres e-mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                value={userData?.email || ''}
                disabled
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Email nie może być zmieniony</p>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Numer telefonu
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+48 123 456 789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="currency" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Waluta domyślna
              </label>
              <select
                id="currency"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                defaultValue="PLN"
                disabled
              >
                <option value="PLN">Polski złoty (PLN)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dolar amerykański (USD)</option>
                <option value="GBP">Funt brytyjski (GBP)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Waluta będzie dostępna do zmiany wkrótce</p>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Język
              </label>
              <select
                id="language"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                defaultValue="pl"
                disabled
              >
                <option value="pl">Polski</option>
                <option value="en">Angielski</option>
                <option value="de">Niemiecki</option>
                <option value="fr">Francuski</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Język będzie dostępny do zmiany wkrótce</p>
            </div>
            
            <div className="pt-3 sm:pt-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};