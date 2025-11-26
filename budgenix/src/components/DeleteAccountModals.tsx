'use client';

import React from 'react';

interface DeleteAccountModalsProps {
  step: 'confirm' | 'verify' | null;
  verificationCode: string;
  message: { type: 'success' | 'error'; text: string } | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onVerify: () => void;
  onCodeChange: (code: string) => void;
}

export default function DeleteAccountModals({
  step,
  verificationCode,
  message,
  loading,
  onClose,
  onConfirm,
  onVerify,
  onCodeChange
}: DeleteAccountModalsProps) {
  if (!step) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
        {step === 'confirm' ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Usunięcie konta</h3>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Czy na pewno chcesz usunąć swoje konto?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <p className="text-xs sm:text-sm text-red-800 font-medium mb-2">
                  ⚠️ Ta operacja jest nieodwracalna!
                </p>
                <ul className="text-xs sm:text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>Wszystkie Twoje dane zostaną permanentnie usunięte</li>
                  <li>Transakcje, budżety i ustawienia przepadną</li>
                  <li>Nie będzie możliwości odzyskania konta</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anuluj
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Wysyłanie...' : 'Usuń konto'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Weryfikacja usunięcia konta
            </h3>
            
            {message && (
              <div className={`p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="text-xs sm:text-sm">{message.text}</p>
              </div>
            )}
            
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Wpisz kod weryfikacyjny, który został wysłany na Twój adres email. 
              Po wprowadzeniu poprawnego kodu, Twoje konto zostanie permanentnie usunięte.
            </p>
            
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-3 sm:mb-4"
              placeholder="123456"
              maxLength={6}
              disabled={loading}
            />
            
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anuluj
              </button>
              <button
                onClick={onVerify}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Usuwanie...' : 'Potwierdź usunięcie'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
