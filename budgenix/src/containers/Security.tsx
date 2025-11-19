'use client';

import React, { useState, useEffect } from 'react';

interface Device {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress?: string;
  createdAt: string;
  lastActiveAt: string;
}

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);

  useEffect(() => {
    fetchTwoFactorStatus();
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchTwoFactorStatus = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/auth/2fa/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTwoFactorEnabled(data.twoFactorEnabled);
      }
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
    }
  };

  const fetchDevices = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/user/devices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setDevicesLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordLoading(true);

    try {
      const token = getToken();
      if (!token) {
        setPasswordMessage({ type: 'error', text: 'Brak autoryzacji' });
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: data.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.error });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Wystąpił błąd podczas zmiany hasła' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      setTwoFactorLoading(true);
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch('/api/auth/2fa/disable', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTwoFactorEnabled(data.twoFactorEnabled);
        }
      } catch (error) {
        console.error('Error disabling 2FA:', error);
      } finally {
        setTwoFactorLoading(false);
      }
    } else {
      // Enable 2FA - send code
      setTwoFactorLoading(true);
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch('/api/auth/2fa/enable', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setShowVerificationModal(true);
          setVerificationMessage({ type: 'success', text: 'Kod weryfikacyjny został wysłany na Twój email' });
        }
      } catch (error) {
        console.error('Error enabling 2FA:', error);
      } finally {
        setTwoFactorLoading(false);
      }
    }
  };

  const handleVerifyCode = async () => {
    setVerificationMessage(null);
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/auth/2fa/verify-enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: verificationCode })
      });

      const data = await response.json();

      if (response.ok) {
        setTwoFactorEnabled(data.twoFactorEnabled);
        setShowVerificationModal(false);
        setVerificationCode('');
        setVerificationMessage(null);
      } else {
        setVerificationMessage({ type: 'error', text: data.error });
      }
    } catch {
      setVerificationMessage({ type: 'error', text: 'Wystąpił błąd podczas weryfikacji kodu' });
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`/api/user/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDevices();
      }
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/user/devices/logout-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDevices();
      }
    } catch (error) {
      console.error('Error logging out all devices:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      return 'Aktywna teraz';
    } else if (diffInHours < 24) {
      return `Ostatnio: ${diffInHours} ${diffInHours === 1 ? 'godzinę' : 'godzin'} temu`;
    } else {
      return `Ostatnio: ${diffInDays} ${diffInDays === 1 ? 'dzień' : 'dni'} temu`;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Ustawienia bezpieczeństwa</h2>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Password Change Section */}
          <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-2">Zmiana hasła</h3>
            
            {passwordMessage && (
              <div className={`p-2.5 sm:p-3 rounded-lg ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="text-xs sm:text-sm">{passwordMessage.text}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="currentPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Aktualne hasło
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Nowe hasło
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Hasło powinno zawierać co najmniej 8 znaków, w tym wielkie i małe litery, cyfry oraz znaki specjalne.
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Potwierdź nowe hasło
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={passwordLoading}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Zmiana...' : 'Zmień hasło'}
              </button>
            </div>
          </form>
          
          {/* Two-Factor Authentication Section */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-2">Weryfikacja dwuetapowa</h3>
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800">Weryfikacja dwuetapowa</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Dodatkowa warstwa zabezpieczeń dla Twojego konta</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={twoFactorEnabled}
                  onChange={handleTwoFactorToggle}
                  disabled={twoFactorLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="pl-3 sm:pl-4 border-l-2 border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                Weryfikacja dwuetapowa wymaga podania kodu z wiadomości e-mail przy każdym logowaniu.
                To znacznie zwiększa bezpieczeństwo Twojego konta, nawet jeśli Twoje hasło zostanie przejęte.
              </p>
            </div>
          </div>
          
          {/* Devices Section */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-2">Sesje i urządzenia</h3>
            
            {devicesLoading ? (
              <div className="text-center py-3 sm:py-4">
                <p className="text-xs sm:text-sm text-gray-500">Ładowanie urządzeń...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-3 sm:py-4">
                <p className="text-xs sm:text-sm text-gray-500">Brak zarejestrowanych urządzeń</p>
              </div>
            ) : (
              devices.map((device, index) => (
                <div key={device.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {index === 0 ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{device.deviceName} - {device.browser}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {device.ipAddress || 'Nieznana lokalizacja'} • {formatDate(device.lastActiveAt)}
                          </p>
                        </div>
                        {index === 0 ? (
                          <span className="text-[10px] sm:text-xs bg-green-100 text-green-800 px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">Bieżąca</span>
                        ) : (
                          <button 
                            onClick={() => handleDeleteDevice(device.id)}
                            className="text-[10px] sm:text-xs text-red-600 hover:text-red-800 whitespace-nowrap"
                          >
                            Wyloguj
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {devices.length > 1 && (
              <button 
                onClick={handleLogoutAllDevices}
                className="text-xs sm:text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                Wyloguj ze wszystkich urządzeń
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Weryfikacja dwuetapowa</h3>
            
            {verificationMessage && (
              <div className={`p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4 ${verificationMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="text-xs sm:text-sm">{verificationMessage.text}</p>
              </div>
            )}
            
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Wpisz kod weryfikacyjny, który został wysłany na Twój adres email.
            </p>
            
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3 sm:mb-4"
              placeholder="123456"
              maxLength={6}
            />
            
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationCode('');
                  setVerificationMessage(null);
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleVerifyCode}
                className="flex-1 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Weryfikuj
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};