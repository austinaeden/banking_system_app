import React from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  History, 
  User, 
  Settings, 
  Bell, 
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Users,
  CreditCard
} from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export default function Layout({ children, user, onLogout, activeTab, setActiveTab }) {
  const standardNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transfer', label: 'Transfer', icon: ArrowRightLeft },
    { id: 'transactions', label: 'Transactions', icon: History },
  ];

  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems : standardNavItems;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`w-20 md:w-64 flex flex-col transition-all duration-300 z-50 shadow-2xl relative ${user?.role === 'ADMIN' ? 'bg-slate-900' : 'glossy-green'} text-white`}>
        {/* Subtle decorative background matching the role */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[60px] ${user?.role === 'ADMIN' ? 'bg-indigo-500' : 'bg-emerald-300'}`}></div>
        </div>

        <div className="p-6 flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform transition hover:scale-105">
            {user?.role === 'ADMIN' ? (
               <ShieldAlert className="text-slate-900 w-6 h-6" />
            ) : (
               <ShieldCheck className="text-veridian-900 w-6 h-6" />
            )}
          </div>
          <div className="hidden md:block">
            <span className="font-bold text-xl tracking-tight leading-none block">Veridian</span>
            {user?.role === 'ADMIN' && (
              <Badge variant="outline" className="text-[9px] bg-slate-800 text-slate-300 border-none px-1.5 mt-0.5 tracking-widest uppercase">Admin</Badge>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
          <TooltipProvider>
            {navItems.map((item) => (
              <div key={item.id}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                          activeTab === item.id 
                            ? (user?.role === 'ADMIN' ? 'bg-indigo-500/30 shadow-inner' : 'bg-white/20 shadow-inner')
                            : 'hover:bg-white/10'
                        }`}
                      />
                    }
                  >
                    <item.icon className={`w-6 h-6 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`} />
                    <span className={`font-medium hidden md:block ${activeTab === item.id ? 'text-white' : 'text-slate-300'}`}>{item.label}</span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="md:hidden">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </TooltipProvider>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 relative z-10">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
              activeTab === 'profile' ? (user?.role === 'ADMIN' ? 'bg-indigo-500/30' : 'bg-white/20') : 'hover:bg-white/10'
            }`}
          >
            <User className="w-6 h-6 text-slate-300 shrink-0" />
            <span className="font-medium text-slate-300 hidden md:block">Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
              activeTab === 'settings' ? (user?.role === 'ADMIN' ? 'bg-indigo-500/30' : 'bg-white/20') : 'hover:bg-white/10'
            }`}
          >
            <Settings className="w-6 h-6 text-slate-300 shrink-0" />
            <span className="font-medium text-slate-300 hidden md:block">Settings</span>
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="w-6 h-6 shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-slate-50">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-1">{user?.role === 'ADMIN' ? 'System Administrator' : user?.email}</p>
              </div>
              <Avatar className={`w-11 h-11 border-2 ${user?.role === 'ADMIN' ? 'border-indigo-100' : 'border-veridian-100'} shadow-sm`}>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}&backgroundColor=${user?.role === 'ADMIN' ? 'c7d2fe' : 'a7f3d0'}`} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
