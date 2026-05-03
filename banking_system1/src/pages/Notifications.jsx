import React from 'react';
import { Bell, Calendar, Clock, Trash2, ShieldCheck, MailOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Notifications({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Bell className="w-10 h-10 opacity-20" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Clean Slate</h3>
        <p className="text-slate-500 font-medium">You&apos;re all caught up! No new notifications.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Notifications</h1>
          <p className="text-slate-500 font-medium">Stay updated with your account activity</p>
        </div>
        <Button variant="outline" className="rounded-xl font-bold gap-2">
          <MailOpen className="w-4 h-4" />
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id} className="glass-card border-none shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-veridian-50 text-veridian-700 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight">{notif.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          {notif.date}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[10px]">NEW</Badge>
                  </div>
                  
                  <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
