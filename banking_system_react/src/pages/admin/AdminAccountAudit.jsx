import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Calendar,
  CreditCard,
  User,
  BadgeDollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

export default function AdminAccountAudit({ account, onBack }) {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!account?.id) return;

    const loadData = async () => {
      setLoading(true);
      
      try {
        const [txs, data] = await Promise.all([
          api.getAccountTransactions(account.id),
          api.getAdminData()
        ]);

        // Prioritize direct fetch, fallback to manual filtering if necessary
        if (Array.isArray(txs) && txs.length > 0) {
          setTransactions(txs);
        } else if (data?.allTransactions) {
          const fallback = data.allTransactions.filter(
            tx => String(tx.accountId) === String(account.id)
          );
          setTransactions(fallback);
        } else {
          setTransactions([]);
        }

        if (data?.allUsers) {
          setUsers(data.allUsers);
        }
      } catch (err) {
        console.error("Audit load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [account?.id]);

  const filteredTransactions = transactions.filter(tx => {
    const search = searchTerm.toLowerCase();
    return (tx.payee || '').toLowerCase().includes(search) ||
           (tx.category || '').toLowerCase().includes(search) ||
           String(tx.id).includes(search);
  });

  const owner = users.find(u => u.id === account?.userId);

  if (!account) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header & Back Button */}
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="w-fit gap-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 -ml-4 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ledger
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Account Audit
              <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-black px-3">
                {account.accountNumber}
              </Badge>
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">
              Detailed financial forensics for {owner?.username || 'Member'}'s account
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl border-slate-200 font-bold shadow-sm hover:bg-slate-50">
              Download Statement
            </Button>
          </div>
        </div>
      </div>

      {/* Account Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Owner</p>
              <p className="text-xl font-bold text-slate-900">{owner?.username || 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Type</p>
              <p className="text-xl font-bold text-slate-900">{account.type}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-indigo-600 text-white rounded-3xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/80">
              <BadgeDollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-white/60 uppercase tracking-widest">Current Balance</p>
              <p className="text-2xl font-black">${Number(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="p-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-black text-slate-900">
                Transaction History 
                {transactions.length > 0 && (
                  <span className="ml-3 text-sm font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {transactions.length} Records
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">Internal audit of all account movements</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search tx, payee, category..." 
                className="pl-10 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Running audit forensics...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-20 text-center space-y-4 bg-slate-50/30 m-6 rounded-3xl border-2 border-dashed border-slate-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-slate-200">
                <BadgeDollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-slate-900 font-black text-xl">No transactions found</p>
                <p className="text-slate-500 font-medium">This account has no recorded financial activity in the system.</p>
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <p className="font-bold text-lg">No results match your search.</p>
              <Button variant="link" onClick={() => setSearchTerm('')} className="text-indigo-600">Clear filter</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-y border-slate-100">
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            Number(tx.amount) > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                            {Number(tx.amount) > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{tx.payee}</p>
                            <p className="text-xs text-slate-400 font-medium">TX-ID: {tx.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-600">{tx.date}</p>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-slate-200 bg-white font-bold text-slate-500">
                          {tx.category}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className={`text-xl font-black tracking-tighter ${Number(tx.amount) > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
