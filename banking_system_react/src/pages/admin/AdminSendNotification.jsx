import React, { useState } from 'react';
import { Send, Bell, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSendNotification({ onSendNotification }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !message) return;
    
    onSendNotification({
      name: title,
      message,
    });
    
    setTitle('');
    setMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Send Notification</h1>
          <p className="text-slate-500 font-medium mt-1">Broadcast messages and alerts to users</p>
        </div>
      </div>

      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-8">
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Notification Title</label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. System Maintenance Update"
                className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message Content</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full min-h-[150px] p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg resize-y"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 px-4 py-2 rounded-xl">
                <Users className="w-4 h-4 text-indigo-500" />
                This message will be sent to all users
              </div>
              
              <Button type="submit" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 gap-2">
                <Send className="w-5 h-5" />
                Send Notification
              </Button>
            </div>
            
            {success && (
              <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 font-bold animate-in fade-in slide-in-from-bottom-2">
                <Bell className="w-5 h-5" />
                Notification sent successfully!
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
