import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Camera,
  Trash2,
  Shield,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function Profile({ user, onUpdate, onUpdatePhoto }) {
  const [formData, setFormData] = useState({
    name: user.name || user.username,
    email: user.email,
    phone: user.phone || user.phoneNumber
  });
  const [photoUrl, setPhotoUrl] = useState(user.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select a file smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      onUpdatePhoto(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await onUpdate(formData);
    setLoading(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
            <AvatarImage src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
            <AvatarFallback>{(user.name || user.username).charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 flex gap-2">
            <label
              htmlFor="photo-upload"
              className="p-2 bg-veridian-700 text-white rounded-full shadow-lg hover:bg-veridian-800 transition-colors cursor-pointer flex items-center justify-center border-2 border-white"
              title="Change photo"
            >
              <Camera className="w-4 h-4" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
            {user.profilePhoto && (
              <button
                onClick={handleRemovePhoto}
                className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center border-2 border-white"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{user.name || user.username}</h1>
          <p className="text-slate-500">
            Member since {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'Recent'} • Premium Account
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and public profile</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="name"
                        className="pl-10 h-11"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10 h-11"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="phone"
                        className="pl-10 h-11"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  {saved && (
                    <div className="flex items-center gap-2 text-emerald-600 font-medium animate-in fade-in slide-in-from-left-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Changes saved successfully
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="ml-auto bg-veridian-700 hover:bg-veridian-800 text-white px-8 h-11 rounded-xl"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-veridian-50 text-veridian-700 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Login Notifications</p>
                    <p className="text-xs text-slate-500">Get notified of new login attempts</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glossy-green text-white border-none">
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-veridian-200 text-xs uppercase font-bold tracking-wider">Account Tier</p>
                <p className="text-xl font-bold">MiniBank Elite</p>
              </div>
              <Separator className="bg-white/10" />
              <div className="space-y-1">
                <p className="text-veridian-200 text-xs uppercase font-bold tracking-wider">Daily Limit</p>
                <p className="text-xl font-bold">$50,000.00</p>
              </div>
              <Button className="w-full bg-white text-veridian-900 hover:bg-veridian-50 font-bold">
                Upgrade Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
