"use client";
import Notifications from '@/containers/Notifications';
import Profile from '@/containers/Profile';
import Security from '@/containers/Security';
import Appearance from '@/containers/Appearance';
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
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Ustawienia</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Dostosuj aplikację do swoich potrzeb</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 sm:flex-none sm:px-4 px-2 py-2 font-medium text-[10px] sm:text-sm whitespace-nowrap ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil
        </button>
        <button 
          className={`flex-1 sm:flex-none sm:px-4 px-2 py-2 font-medium text-[10px] sm:text-sm whitespace-nowrap ${activeTab === 'notifications' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('notifications')}
        >
          Powiad.
        </button>
        <button 
          className={`flex-1 sm:flex-none sm:px-4 px-2 py-2 font-medium text-[10px] sm:text-sm whitespace-nowrap ${activeTab === 'security' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('security')}
        >
          Bezpiecz.
        </button>
        <button 
          className={`flex-1 sm:flex-none sm:px-4 px-2 py-2 font-medium text-[10px] sm:text-sm whitespace-nowrap ${activeTab === 'appearance' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('appearance')}
        >
          Wygląd
        </button>
      </div>
      {/* Tab content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
}