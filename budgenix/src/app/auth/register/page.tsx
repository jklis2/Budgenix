"use client";

import { useState } from "react";
import AuthInput from "@/components/ui/AuthInput";
import Link from "next/link";
import { buildApiUrl } from '@/lib/utils/apiUrl';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // Reset error and message
    setError("");
    setMessage("");

    // Basic validation
    if (!email || !password) {
      setError("Wszystkie pola są wymagane");
      return;
    }

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    try {
      const res = await fetch(buildApiUrl("/api/auth/register"), {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message || "Konto zostało utworzone pomyślnie. Możesz się teraz zalogować.");
      } else {
        setError(data.error || "Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">Budgenix</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-800">Utwórz nowe konto</h2>
          <p className="mt-2 text-sm text-gray-500">Rozpocznij zarządzanie swoimi finansami już dziś</p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100">
          <div className="space-y-6">
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
            
            <AuthInput 
              label="Hasło" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              error={error && password === "" ? "Hasło jest wymagane" : ""}
            />
            
            <AuthInput 
              label="Potwierdź hasło" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              error={password !== confirmPassword ? "Hasła nie są identyczne" : ""}
            />
            
            <div className="pt-2">
              <button 
                onClick={handleRegister} 
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Zarejestruj się
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Masz już konto?{" "}
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Zaloguj się
                </Link>
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs text-gray-500">Twoje dane są bezpieczne i szyfrowane</p>
          </div>
        </div>
      </div>
    </div>
  );
}
