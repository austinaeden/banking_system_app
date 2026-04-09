/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAccounts from './pages/admin/AdminAccounts';
import AdminTransactions from './pages/admin/AdminTransactions';
import { mockDb } from './lib/mockDb';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // When a user logs in or is restored, load appropriate data
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      const data = mockDb.getUserData(user.id);
      setAccounts(data.accounts);
      setTransactions(data.transactions);
    }
    setLoading(false);
  }, [user]);

  const handleLogin = async (email, pass) => {
    const res = mockDb.login(email, pass);
    if (res.success) {
      setUser(res.user);
      // Set correct default tab based on role
      setActiveTab(res.user.role === 'ADMIN' ? 'overview' : 'dashboard');
      return true;
    }
    return false;
  };

  const handleTransfer = async (transferData) => {
    const res = mockDb.transfer(transferData.fromAccount, transferData.toAccount, transferData.amount, user.id);
    if (res.success) {
      const data = mockDb.getUserData(user.id);
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      return true;
    }
    return false;
  };

  const handleUpdateProfile = async (profileData) => {
    const res = mockDb.updateProfile(profileData, user.id);
    if (res.success) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Render appropriate view based on activeTab and User Role
  const renderView = () => {
    // Admin Views
    if (user.role === 'ADMIN') {
      switch (activeTab) {
        case 'overview': return <AdminOverview />;
        case 'users': return <AdminUsers />;
        case 'accounts': return <AdminAccounts />;
        case 'transactions': return <AdminTransactions />;
        case 'profile': return <Profile user={user} onUpdate={handleUpdateProfile} />;
        case 'settings': return <div className="p-8 text-slate-400">System settings coming soon...</div>;
        default: return <AdminOverview />;
      }
    }

    // Standard User Views
    switch (activeTab) {
      case 'dashboard': return <Dashboard accounts={accounts} transactions={transactions} />;
      case 'transfer': return <Transfer accounts={accounts} onTransfer={handleTransfer} />;
      case 'transactions': return <Transactions transactions={transactions} />;
      case 'profile': return <Profile user={user} onUpdate={handleUpdateProfile} />;
      case 'settings': return <div className="flex items-center justify-center h-[60vh] text-slate-400">Settings module coming soon...</div>;
      default: return <Dashboard accounts={accounts} transactions={transactions} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={() => {
        setUser(null);
        setActiveTab('dashboard');
      }} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {renderView()}
    </Layout>
  );
}
