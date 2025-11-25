"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthInput from "@/components/ui/AuthInput";
import Link from "next/link";
import { buildApiUrl } from '@/lib/utils/apiUrl';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendEmail = async () => {
    setError("");
    setMessage("");
    
    if (!email) {
      setError("Email jest wymagany");
      return;
    }

    try {
      const res = await fetch(buildApiUrl("/api/auth/reset-password"), {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message || "Link do resetowania hasła został wysłany na podany adres email.");
        setIsSubmitted(true);
      } else {
        setError(data.error || "Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Wystąpił błąd podczas wysyłania linku. Spróbuj ponownie później.");
    }
  };

  const handleSetNewPassword = async () => {
    setError("");
    setMessage("");
    
    if (!newPassword || !confirmPassword) {
      setError("Wszystkie pola są wymagane");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    if (newPassword.length < 8) {
      setError("Hasło musi mieć minimum 8 znaków");
      return;
    }

    try {
      const res = await fetch(buildApiUrl("/api/auth/change-password"), {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("Hasło zostało zmienione pomyślnie!");
        setIsSubmitted(true);
      } else {
        setError(data.error || "Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Wystąpił błąd podczas zmiany hasła. Spróbuj ponownie później.");
    }
  };

  // Conditional rendering based on token presence
  if (token) {
    // Show new password form
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-600">Budgenix</h1>
            <h2 className="mt-2 text-xl font-semibold text-gray-800">Ustaw nowe hasło</h2>
            <p className="mt-2 text-sm text-gray-500">Wprowadź nowe hasło do swojego konta</p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100">
            {isSubmitted ? (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{message}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/auth/login"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Przejdź do logowania
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <AuthInput 
                  label="Nowe hasło" 
                  type="password"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Minimum 8 znaków"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
                
                <AuthInput 
                  label="Potwierdź hasło" 
                  type="password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Powtórz hasło"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
                
                <div className="pt-2">
                  <button 
                    onClick={handleSetNewPassword} 
                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Ustaw nowe hasło
                  </button>
                </div>
              </div>
            )}
            
            {error && !isSubmitted && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show email form (no token)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">Budgenix</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-800">Resetowanie hasła</h2>
          <p className="mt-2 text-sm text-gray-500">Wyślemy Ci link do zresetowania hasła</p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100">
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{message}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Sprawdź swoją skrzynkę email i postępuj zgodnie z instrukcjami.
                </p>
              </div>
              
              <div className="pt-4">
                <Link 
                  href="/auth/login"
                  className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Powrót do logowania
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-indigo-700">
                  Wprowadź adres email powiązany z Twoim kontem. Wyślemy Ci link do zresetowania hasła.
                </p>
              </div>
              
              <AuthInput 
                label="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="twoj@email.com"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
                error={error && email === "" ? "Email jest wymagany" : ""}
              />
              
              <div className="pt-2">
                <button 
                  onClick={handleSendEmail} 
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Wyślij link resetujący
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Pamiętasz swoje hasło?{" "}
                  <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Zaloguj się
                  </Link>
                </p>
              </div>
            </div>
          )}
          
          {error && !isSubmitted && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-gray-500">Bezpieczne resetowanie hasła</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Ładowanie...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
