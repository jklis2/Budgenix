"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { AccountCard } from "@/components/ui/AccountCard";
import { AccountDetailsModal } from "@/components/ui/AccountDetailsModal";
import { Account } from "@/constants/accountsData";
import AccountFormModal from "@/components/ui/AccountFormModal";
import { SearchBar } from '@/components/ui/SearchBar';
import { formatCurrency } from '@/constants/accountsData';

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      setError("Failed to load accounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsFormModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsFormModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingAccount(null);
  };

  const handleAccountSaved = () => {
    setIsFormModalOpen(false);
    setEditingAccount(null);
    fetchAccounts();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Accounts</h1>
          <p className="text-gray-600">
            Total Balance: {formatCurrency(totalBalance)}
          </p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <button
            onClick={handleAddAccount}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
          >
            <FaPlus className="mr-2" />
            Add Account
          </button>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar 
          placeholder="Search accounts..." 
          onSearch={handleSearch} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No accounts found</p>
          <button
            onClick={handleAddAccount}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onClick={() => handleAccountClick(account)}
              onEdit={() => handleEditAccount(account)}
            />
          ))}
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModal}
          onEdit={() => handleEditAccount(selectedAccount)}
        />
      )}

      {/* Account Form Modal (Add/Edit) */}
      <AccountFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
        account={editingAccount}
        onSave={handleAccountSaved}
      />
    </div>
  );
}
