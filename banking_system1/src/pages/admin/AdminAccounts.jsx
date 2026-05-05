import React, { useState, useEffect } from 'react';
import { Search, Filter, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export default function AdminAccounts({ onViewAudit }) {
  const [adminData, setAdminData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await api.getAdminData();
      setAdminData(data);
    };
    loadData();
  }, []);

  if (!adminData) return null;

  const allAccounts = adminData?.allAccounts || [];
  const allUsers = adminData?.allUsers || [];

  const handleToggleFreeze = async (accountId) => {
    const res = await api.toggleFreezeAccount(accountId);
    if (res.success) {
      // Refresh data
      const data = await api.getAdminData();
      setAdminData(data);
    }
  };

  const filteredAccounts = allAccounts.filter(acc => 
    (acc.accountNumber || '').includes(searchTerm) ||
    (acc.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Accounts</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor all financial ledgers</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search by account number or type..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-indigo-500 text-lg font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-8 bg-white border-slate-200 text-slate-700 rounded-2xl font-bold text-lg shadow-sm hover:bg-slate-50 gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((acc) => {
          const owner = allUsers.find(u => u.id === acc.userId);
          return (
            <Card key={acc.id} className={`border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group bg-gradient-to-br from-white to-slate-50/50 ${acc.isFrozen ? 'opacity-75 grayscale-[0.5]' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className={`mb-3 text-[10px] tracking-widest uppercase border-none px-2 py-0.5 ${
                        acc.type === 'Checking' ? 'bg-blue-100 text-blue-700' :
                        acc.type === 'Savings' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {acc.type}
                      </Badge>
                      {acc.isFrozen && (
                        <Badge variant="outline" className="mb-3 text-[10px] tracking-widest uppercase border-none px-2 py-0.5 bg-red-100 text-red-700 font-bold">
                          FROZEN
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-wider font-mono">{acc.accountNumber}</h4>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner ${acc.isFrozen ? 'bg-red-50 text-red-400' : 'bg-indigo-50 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-indigo-500/30'}`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-slate-500 font-medium">Owner</span>
                    <span className="font-bold text-slate-900">{owner?.username || 'Unknown'}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200/50">
                    <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Available Balance</p>
                    <p className="text-3xl font-black text-slate-900">${acc.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button 
                    onClick={() => handleToggleFreeze(acc.id)}
                    variant="outline" 
                    className={`rounded-xl border-slate-200 font-bold transition-colors ${
                      acc.isFrozen 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {acc.isFrozen ? 'Unfreeze' : 'Freeze'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-slate-200 text-indigo-600 font-bold hover:bg-indigo-50"
                    onClick={() => onViewAudit(acc)}
                  >
                    Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
