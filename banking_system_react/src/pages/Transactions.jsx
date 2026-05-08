import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

export default function Transactions({ transactions }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [dateRange, setDateRange] = useState('all');

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.payee.toLowerCase().includes(search.toLowerCase()) || 
                         tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    
    // Date range filter
    let matchesDate = true;
    if (dateRange !== 'all') {
      const txDate = new Date(tx.date);
      const now = new Date();
      if (dateRange === 'today') {
        matchesDate = txDate.toDateString() === now.toDateString();
      } else if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesDate = txDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        matchesDate = txDate >= monthAgo;
      }
    }

    return matchesSearch && matchesType && matchesDate;
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return Math.abs(b.amount) - Math.abs(a.amount);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Search by payee or category..." 
            className="pl-10 h-12 rounded-xl bg-white border-slate-200 focus:ring-veridian-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 rounded-xl gap-2 bg-white">
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Transaction Type</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilterType('all')}>All Transactions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('deposit')}>Deposits Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('withdrawal')}>Withdrawals Only</DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Date Range</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setDateRange('all')}>All Time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('today')}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('week')}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('month')}>Last 30 Days</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSortBy('date')}>Date (Newest)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('amount')}>Amount (Highest)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-12 rounded-xl gap-2 bg-white">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <span className="font-semibold text-slate-900">{tx.payee}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none">
                      {tx.category}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {tx.date}
                  </td>
                  <td className={`p-4 text-right font-bold ${
                    tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium">No transactions found matching your criteria</p>
            <Button variant="link" onClick={() => {setSearch(''); setFilterType('all'); setDateRange('all');}} className="text-veridian-700">
              Clear all filters
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
