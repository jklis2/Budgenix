"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/ui/AuthInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [code, setCode] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.message === "2FA code sent to email") {
      setShow2FA(true);
    } else if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard"); // Przekierowanie po zalogowaniu
    } else {
      setMessage(data.message || data.error);
    }
  };

  const handle2FAVerify = async () => {
    const res = await fetch("/api/auth/verify-2fa", {
      method: "POST",
      body: JSON.stringify({ email, code }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard"); // Przekierowanie po pomyślnej weryfikacji 2FA
    } else {
      setMessage(data.message || data.error);
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
