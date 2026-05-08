import React, { useState, useEffect } from 'react';
import { Search, Download, ArrowUpRight, ArrowDownLeft, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export default function AdminTransactions({ initialAccountId, onBack }) {
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

  const allTransactions = adminData?.allTransactions || [];
  const allUsers = adminData?.allUsers || [];

  const filteredTransactions = allTransactions.filter(tx => 
    (!initialAccountId || String(tx.accountId) === String(initialAccountId)) &&
    ((tx.payee || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.category || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          {initialAccountId && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="gap-2 text-slate-500 hover:text-slate-900 mb-4 -ml-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Accounts
            </Button>
          )}
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {initialAccountId ? `Account Audit: ${filteredTransactions[0]?.accountNumber || initialAccountId}` : 'System Transactions'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {initialAccountId ? 'Detailed transaction history for this account' : 'Real-time ledger and transaction history'}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search transactions by payee or category..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-indigo-500 text-lg font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-8 bg-white border-slate-200 text-slate-700 rounded-2xl font-bold text-lg shadow-sm hover:bg-slate-50 gap-2">
          <Download className="w-5 h-5" />
          Export CSV
        </Button>
      </div>

      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((tx) => {
                const user = allUsers.find(u => u.id === tx.userId);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          tx.amount > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <p className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">{tx.payee}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-600">{user?.username || 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{tx.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-slate-200 bg-white font-bold">{tx.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-lg font-black tracking-tight ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.amount > 0 ? '+' : ''}{(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
