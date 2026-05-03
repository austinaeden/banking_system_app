import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, MapPin, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockDb } from '@/lib/mockDb';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(mockDb.getAdminData().allUsers);
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-1">View and manage all registered members</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-indigo-500 text-lg font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 gap-2">
          <UserPlus className="w-5 h-5" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group bg-white relative">
            <div className={`h-24 ${user.role === 'ADMIN' ? 'bg-indigo-600' : 'bg-slate-800'}`}></div>
            <CardContent className="p-6 pt-0 relative">
              <div className="flex justify-between items-start">
                <div className="-mt-12 w-24 h-24 rounded-2xl bg-white p-1 rounded-full shadow-lg">
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-black text-white ${user.role === 'ADMIN' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                    {user.name.charAt(0)}
                  </div>
                </div>
                <Badge className={`mt-4 border-none shadow-sm ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {user.role}
                </Badge>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-900 truncate">{user.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-slate-500">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-slate-500">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{user.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl bg-slate-50 border-slate-200 text-slate-700 font-semibold hover:bg-slate-100">Profile</Button>
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
