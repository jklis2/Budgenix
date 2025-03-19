"use client";

import { useState } from "react";
import AuthInput from "@/components/ui/AuthInput";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>
      <AuthInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleReset} className="w-full mt-4 py-2 bg-red-500 text-white rounded-md">
        Send Reset Link
      </button>
      {message && <p className="mt-2 text-center text-sm">{message}</p>}
    </div>
  );
}
