"use client";

import React, { useState, useEffect } from "react";
import { Account, accountTypes, currencyOptions } from "@/constants/accountsData";
import { buildApiUrl } from "@/lib/utils/apiUrl";

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onSave: () => void;
}

export default function AccountFormModal({
  isOpen,
  onClose,
  account,
  onSave,
}: AccountFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    balance: "0",
    accountType: "Checking",
    currency: "PLN",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<string | null>(null);

  // Initialize form with account data if editing
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        balance: account.balance.toString(),
        accountType: account.accountType,
        currency: account.currency,
        isDefault: account.isDefault,
      });
    } else {
      // Reset form for new account
      setFormData({
        name: "",
        balance: "0",
        accountType: "Checking",
        currency: "PLN",
        isDefault: false,
      });
    }
  }, [account, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseDetails(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const url = account
        ? buildApiUrl(`/api/accounts/${account.id}`)
        : buildApiUrl("/api/accounts");
      
      const method = account ? "PUT" : "POST";

      const requestBody = {
        name: formData.name,
        balance: parseFloat(formData.balance),
        accountType: formData.accountType,
        currency: formData.currency,
        isDefault: formData.isDefault,
      };

      console.log("Sending request:", {
        url,
        method,
        body: requestBody
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save account");
      }

      console.log("Account saved successfully:", responseData);
      onSave();
    } catch (err) {
      console.error("Error saving account:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save account";
      setError(errorMessage);
      
      // Try to get more details from the error
      if (errorMessage.includes("Failed to create account:")) {
        const details = errorMessage.split("Failed to create account:")[1].trim();
        setResponseDetails(details);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {account ? "Edytuj Konto" : "Dodaj Nowe Konto"}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              {responseDetails && (
                <div className="mt-2 text-sm">
                  <strong>Details:</strong> {responseDetails}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nazwa Konta
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Główne Konto Osobiste"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="balance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Saldo
              </label>
              <input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="accountType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Typ Konta
              </label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accountTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Waluta
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ustaw jako domyślne konto
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Domyślne konto będzie używane dla transakcji, gdy nie określono konta.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Zapisywanie..." : account ? "Aktualizuj Konto" : "Utwórz Konto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
