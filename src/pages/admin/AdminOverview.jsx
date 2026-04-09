import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Activity, ShieldAlert, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDb } from '@/lib/mockDb';

export default function AdminOverview() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    setAdminData(mockDb.getAdminData());
  }, []);

  if (!adminData) return <div className="p-8 text-center text-slate-500 font-medium">Loading Dashboard Data...</div>;

  const { stats, allUsers, allTransactions } = adminData;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium mt-1">High-level metrics and recent platform activity</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 gap-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </Badge>
          <Button variant="outline" size="sm" className="gap-2 font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50">
            <Activity className="w-4 h-4" />
            System Logs
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Liquidity', value: `$${stats.totalLiquidity.toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-500', shadow: 'shadow-indigo-500/30' },
          { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/30' },
          { label: 'Total Transactions', value: stats.totalTransactions, icon: Activity, color: 'bg-amber-500', shadow: 'shadow-amber-500/30' },
          { label: 'Security Status', value: stats.systemHealth, icon: ShieldAlert, color: 'bg-rose-500', shadow: 'shadow-rose-500/30' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg ${stat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-md hover:shadow-lg transition-all rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-xl">Latest Users</CardTitle>
            <CardDescription className="font-medium">Recent registrations on the platform</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {allUsers.slice(-5).reverse().map((user) => (
                <div key={user.id} className="flex items-center justify-between p-5 hover:bg-indigo-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'} hover:bg-indigo-200 border-none px-2 py-1 uppercase tracking-widest`}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-all rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription className="font-medium">Latest system-wide transactions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {allTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-emerald-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                      tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">{tx.payee}</p>
                      <p className="text-xs text-slate-500 font-medium">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`text-lg font-black tracking-tight ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    ${Math.abs(tx.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
