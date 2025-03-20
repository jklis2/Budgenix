"use client";
import Notifications from '@/containers/Notifications';
import Profile from '@/containers/Profile';
import Security from '@/containers/Security';
import Appearance from '@/containers/Appearance';
import Preferences from '@/containers/Preferences';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderProfileSettings = () => {
    return <Profile />;
  };  

  const renderNotificationSettings = () => {
    return <Notifications />;
  };

  const renderSecuritySettings = () => {
    return <Security />;
  };

  const renderAppearanceSettings = () => {
    return <Appearance />;  
  };

  const renderPreferencesSettings = () => {
    return <Preferences />;
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