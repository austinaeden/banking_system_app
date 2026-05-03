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
import AdminSendNotification from './pages/admin/AdminSendNotification';
import Notifications from './pages/Notifications';
import { api } from './lib/api';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: 'Security Alert',
      date: 'MAY 03, 2026',
      time: '19:15 PM',
      message: 'A new login was detected from a new device in your location.',
    },
    {
      id: 2,
      name: 'System Update',
      date: 'MAY 02, 2026',
      time: '10:00 AM',
      message: 'MiniBank systems will undergo scheduled maintenance this Sunday at 2:00 AM.',
    }
  ]);

  // When a user logs in or is restored, load appropriate data
  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.role !== 'ADMIN') {
        const data = await api.getUserData(user.id);
        setAccounts(data.accounts);
        setTransactions(data.transactions);
        if (data.notifications) setNotifications(data.notifications);
      }
      setLoading(false);
    };
    loadUserData();
  }, [user]);

  const handleLogin = async (email, pass) => {
    const res = await api.login(email, pass);
    if (res.success) {
      setUser(res.user);
      // Set correct default tab based on role
      setActiveTab(res.user.role === 'ADMIN' ? 'overview' : 'dashboard');
      return true;
    }
    // Return the error message so Auth.jsx can show it
    return res.message || 'Invalid email or password';
  };

  const handleRegister = async (username, email, pass) => {
    const res = await api.register(username, email, pass);
    if (res.success) {
      setUser(res.user);
      setActiveTab('dashboard');
      return true;
    }
    return res.message || 'Registration failed';
  };

  const handleTransfer = async (transferData) => {
    const res = await api.transfer(transferData.fromAccount, transferData.toAccount, transferData.amount, user.id);
    if (res.success) {
      const data = await api.getUserData(user.id);
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      return true;
    }
    return false;
  };

  const handleUpdateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData, user.id);
    if (res.success) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  const handleUpdatePhoto = async (photoUrl) => {
    const res = await api.updatePhoto(photoUrl, user.id);
    if (res.success) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  const handleSendNotification = async (notif) => {
    const res = await api.sendNotification(notif.name, notif.message);
    if (res.success) {
      const newNotif = {
        id: Date.now(),
        ...notif,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
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
        case 'send-notifications': return <AdminSendNotification onSendNotification={handleSendNotification} />;
        case 'profile': return <Profile user={user} onUpdate={handleUpdateProfile} onUpdatePhoto={handleUpdatePhoto} />;
        case 'settings': return <div className="p-8 text-slate-400">System settings coming soon...</div>;
        case 'notifications': return <Notifications notifications={notifications} />;
        default: return <AdminOverview />;
      }
    }

    // Standard User Views
    switch (activeTab) {
      case 'dashboard': return <Dashboard accounts={accounts} transactions={transactions} />;
      case 'transfer': return <Transfer accounts={accounts} onTransfer={handleTransfer} />;
      case 'transactions': return <Transactions transactions={transactions} />;
      case 'profile': return <Profile user={user} onUpdate={handleUpdateProfile} onUpdatePhoto={handleUpdatePhoto} />;
      case 'settings': return <div className="flex items-center justify-center h-[60vh] text-slate-400">Settings module coming soon...</div>;
      case 'notifications': return <Notifications notifications={notifications} />;
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
