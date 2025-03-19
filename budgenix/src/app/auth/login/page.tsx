"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthInput from "@/components/ui/AuthInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [code, setCode] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
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
      const res = await fetch("/api/auth/verify-2fa", {
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
      {show2FA ? (
        <>
          <AuthInput label="2FA Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button onClick={handle2FAVerify} className="w-full mt-4 py-2 bg-green-500 text-white rounded-md">
            Verify
          </button>
        </>
      ) : (
        <>
          <AuthInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <span>Remember me</span>
          </div>
          <button onClick={handleLogin} className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md">
            Login
          </button>
        </>
      )}
      {message && <p className="mt-2 text-center text-sm text-red-500">{message}</p>}
    </div>
  );
}
