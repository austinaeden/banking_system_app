import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft,
  MoreVertical
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Dashboard({ accounts, transactions }) {
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  const chartData = accounts.map(acc => ({
    name: acc.type,
    value: acc.balance
  }));

  const COLORS = ['#064e3b', '#059669', '#10b981', '#34d399'];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <Card className="glossy-green text-white border-none shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-veridian-100 font-medium text-sm uppercase tracking-wider">Total Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-veridian-200 text-sm">
              <Badge className="bg-white/20 text-white border-none">+2.4% from last month</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Individual Accounts */}
        {accounts.slice(0, 2).map((acc) => (
          <Card key={acc.id} className="glass-card hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{acc.type} Account</CardTitle>
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400 mt-1">{acc.accountNumber}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-veridian-600 h-full w-3/4 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Monthly Cash Flow</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jan', in: 4000, out: 2400 },
                { name: 'Feb', in: 3000, out: 1398 },
                { name: 'Mar', in: 2000, out: 9800 },
                { name: 'Apr', in: 2780, out: 3908 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="in" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Recent Transactions</CardTitle>
          <Button variant="ghost" className="text-veridian-700 hover:text-veridian-800 hover:bg-veridian-50">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{tx.payee}</p>
                    <p className="text-xs text-slate-500">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <div className={`text-right font-bold ${
                  tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {tx.type === 'deposit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
