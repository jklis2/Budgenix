"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthInput from "@/components/ui/AuthInput";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { buildApiUrl } from '@/lib/utils/apiUrl';

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [code, setCode] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Check if user is already logged in with a valid token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded: { id?: string; email?: string; exp?: number } = jwtDecode(token);

      // Token must have required fields and not be expired
      if (!decoded.id || !decoded.email || !decoded.exp) {
        localStorage.removeItem("token");
        return;
      }

      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (decoded.exp < nowInSeconds) {
        localStorage.removeItem("token");
        return;
      }

      // If token is valid, redirect
      router.push(redirectPath);
    } catch (error) {
      // If decoding fails, clear invalid token and stay on login page
      console.error("Invalid JWT token on login page: ", error);
      localStorage.removeItem("token");
    }
  }, [redirectPath, router]);

  const handleLogin = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        body: JSON.stringify({ email, password, rememberMe }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.message === "2FA code sent to email") {
        setShow2FA(true);
        setMessage("A verification code has been sent to your email.");
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        router.push(redirectPath); // Redirect to the original page user was trying to access
      } else {
        setMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  const handle2FAVerify = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/verify-2fa"), {
        method: "POST",
        body: JSON.stringify({ email, code }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push(redirectPath); // Redirect to the original page user was trying to access
      } else {
        setMessage(data.error || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">Budgenix</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-800">Zaloguj się do swojego konta</h2>
          <p className="mt-2 text-sm text-gray-500">Zarządzaj swoimi finansami w jednym miejscu</p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100">
          {show2FA ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-indigo-700">
                  <span className="font-medium">Weryfikacja dwuetapowa:</span> {message}
                </p>
              </div>
              <AuthInput 
                label="Kod weryfikacyjny" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="Wprowadź 6-cyfrowy kod"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
              <button 
                onClick={handle2FAVerify} 
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Zweryfikuj
              </button>
            </div>
          ) : (
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
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Zapamiętaj mnie
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/auth/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Zapomniałeś hasła?
                  </Link>
                </div>
              </div>
              
              <button 
                onClick={handleLogin} 
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Zaloguj się
              </button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Nie masz jeszcze konta?{" "}
                  <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Zarejestruj się
                  </Link>
                </p>
              </div>
            </div>
          )}
          
          {message && !show2FA && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{message}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-gray-500">Bezpieczne logowanie z szyfrowaniem SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Ładowanie...</div>}>
      <LoginContent />
    </Suspense>
  );
}
