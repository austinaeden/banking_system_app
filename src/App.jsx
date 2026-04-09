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
import { mockDb } from './lib/mockDb';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = mockDb.getUserData();
    setAccounts(data.accounts);
    setTransactions(data.transactions);
    setLoading(false);
  }, []);

  const handleLogin = async (email, pass) => {
    const res = mockDb.login(email, pass);
    if (res.success) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  const handleTransfer = async (transferData) => {
    const res = mockDb.transfer(transferData.fromAccount, transferData.toAccount, transferData.amount);
    if (res.success) {
      const data = mockDb.getUserData();
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      return true;
    }
    return false;
  };

  const handleUpdateProfile = async (profileData) => {
    const res = mockDb.updateProfile(profileData);
    if (res.success) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={() => setUser(null)} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} />}
      {activeTab === 'transfer' && <Transfer accounts={accounts} onTransfer={handleTransfer} />}
      {activeTab === 'transactions' && <Transactions transactions={transactions} />}
      {activeTab === 'profile' && <Profile user={user} onUpdate={handleUpdateProfile} />}
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center h-[60vh] text-slate-400">
          Settings module coming soon...
        </div>
      )}
    </Layout>
  );
}

