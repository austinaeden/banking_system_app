import React from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  History, 
  User, 
  Settings, 
  Bell, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Layout({ children, user, onLogout, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transfer', label: 'Transfer', icon: ArrowRightLeft },
    { id: 'transactions', label: 'Transactions', icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 glossy-green text-white flex flex-col transition-all duration-300 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="text-veridian-900 w-6 h-6" />
          </div>
          <span className="font-bold text-xl hidden md:block tracking-tight">Veridian</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <TooltipProvider>
            {navItems.map((item) => (
              <div key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.id 
                          ? 'bg-white/20 shadow-inner' 
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-6 h-6 shrink-0" />
                      <span className="font-medium hidden md:block">{item.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="md:hidden">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </TooltipProvider>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
              activeTab === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <User className="w-6 h-6 shrink-0" />
            <span className="font-medium hidden md:block">Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
              activeTab === 'settings' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Settings className="w-6 h-6 shrink-0" />
            <span className="font-medium hidden md:block">Settings</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/20 text-red-100 transition-all duration-200"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            <span className="font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-veridian-700 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-veridian-100">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
