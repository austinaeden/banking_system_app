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
import AdminAccountAudit from './pages/admin/AdminAccountAudit';
import AdminSendNotification from './pages/admin/AdminSendNotification';
import Notifications from './pages/Notifications';
import { api } from './lib/api';
import './App.css';

/**
 * Main Application Component.
 * Manages the global state (user, accounts, transactions) and handles routing/view switching.
 */
export default function App() {
  // --- Global State ---
  const [user, setUser] = useState(null); // Currently logged-in user
  const [accounts, setAccounts] = useState([]); // User's bank accounts
  const [transactions, setTransactions] = useState([]); // User's transaction history
  const [activeTab, setActiveTab] = useState('dashboard'); // Current active view/page
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [selectedUser, setSelectedUser] = useState(null); // Admin view: user selected for auditing
  const [selectedAccount, setSelectedAccount] = useState(null); // Admin view: account selected for auditing
  const [notifications, setNotifications] = useState([
    // Initial mock notifications (will be replaced by DB data if available)
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

  /**
   * Effect to load data whenever the user changes (e.g., after login).
   */
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

  // --- Handlers for User Actions ---

  /**
   * Handles user login by calling the backend API.
   */
  const handleLogin = async (email, pass) => {
    const res = await api.login(email, pass);
    if (res.success) {
      setUser(res.user);
      // Set correct default tab based on role: Admin goes to Overview, User goes to Dashboard
      setActiveTab(res.user.role === 'ADMIN' ? 'overview' : 'dashboard');
      return true;
    }
    return res.message || 'Invalid email or password';
  };

  /**
   * Handles new user registration.
   */
  const handleRegister = async (username, email, pass) => {
    const res = await api.register(username, email, pass);
    if (res.success) {
      setUser(res.user);
      setActiveTab('dashboard');
      return true;
    }
    return res.message || 'Registration failed';
  };

  /**
   * Handles fund transfers between accounts.
   */
  const handleTransfer = async (transferData) => {
    const res = await api.transfer(transferData.fromAccount, transferData.toAccount, transferData.amount, user.id);
    if (res.success) {
      // Refresh user data after successful transfer to show updated balances
      const data = await api.getUserData(user.id);
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      return true;
    }
    return false;
  };

  /**
   * Updates the current user's profile information.
   */
  const handleUpdateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData, user.id);
    if (res.success) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  /**
   * Updates the user's profile photo.
   */
  const handleUpdatePhoto = async (photoUrl) => {
    const res = await api.updatePhoto(photoUrl, user.id);
    if (res.success) {
      setUser(res.user);
      return true;
    }
    return false;
  };

  /**
   * Admin: Sends a notification to all users.
   */
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

  /**
   * Deletes a notification (Admin deletes from DB, User just hides it locally).
   */
  const handleDeleteNotification = async (id, isAdmin) => {
    if (isAdmin) {
      const res = await api.deleteNotification(id);
      if (res.success) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } else {
      // For regular users, just hide it locally
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  // If no user is logged in, show the Auth (Login/Register) screen
  if (!user) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }

  /**
   * Logic to determine which component to render based on the active tab and user role.
   */
  const renderView = () => {
    // Admin View Selection
    if (user.role === 'ADMIN') {
      switch (activeTab) {
        case 'overview': return <AdminOverview />;
        case 'users': return <AdminUsers onViewProfile={(u) => { setSelectedUser(u); setActiveTab('user-profile'); }} />;
        case 'accounts': return <AdminAccounts onViewAudit={(acc) => { setSelectedAccount(acc); setActiveTab('account-audit'); }} />;
        case 'transactions': return <AdminTransactions />;
        case 'send-notifications': return <AdminSendNotification onSendNotification={handleSendNotification} />;
        case 'profile': return <Profile key={user.id} user={user} onUpdate={handleUpdateProfile} onUpdatePhoto={handleUpdatePhoto} />;
        case 'settings': return <div className="p-8 text-slate-400">System settings coming soon...</div>;
        case 'notifications': return <Notifications notifications={notifications} user={user} onDelete={handleDeleteNotification} />;
        case 'user-profile': 
          if (!selectedUser) return <div className="p-8 text-slate-400 text-center py-20">Loading profile...</div>;
          return <Profile key={selectedUser.id} user={selectedUser} onUpdate={handleUpdateOtherProfile} onUpdatePhoto={handleUpdateOtherPhoto} isAdminView={true} onBack={() => setActiveTab('users')} />;
        case 'account-audit':
          return <AdminAccountAudit account={selectedAccount} onBack={() => setActiveTab('accounts')} />;
        default: return <AdminOverview />;
      }
    }

    // Standard User View Selection
    switch (activeTab) {
      case 'dashboard': return <Dashboard accounts={accounts} transactions={transactions} />;
      case 'transfer': return <Transfer accounts={accounts} onTransfer={handleTransfer} />;
      case 'transactions': return <Transactions transactions={transactions} />;
      case 'profile': return <Profile user={user} onUpdate={handleUpdateProfile} onUpdatePhoto={handleUpdatePhoto} />;
      case 'settings': return <div className="flex items-center justify-center h-[60vh] text-slate-400">Settings module coming soon...</div>;
      case 'notifications': return <Notifications notifications={notifications} user={user} onDelete={handleDeleteNotification} />;
      default: return <Dashboard accounts={accounts} transactions={transactions} />;
    }
  };

  // Main application layout wrapper
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
