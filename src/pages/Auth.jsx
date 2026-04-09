import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const ok = await onLogin(formData.email, formData.password);
      if (!ok) setError('Invalid email or password');
    } else if (mode === 'register') {
      setTimeout(() => {
        setSuccess('Account created! Please login.');
        setMode('login');
        setLoading(false);
      }, 1500);
      return;
    } else {
      setTimeout(() => {
        setSuccess('Recovery email sent!');
        setMode('login');
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen glossy-green flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-veridian-400 rounded-full blur-[120px]"></div>
      </div>

      <Card className="w-full max-w-md glass-card border-none shadow-2xl z-10">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-veridian-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Join Veridian'}
            {mode === 'recovery' && 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' && 'Secure access to your Veridian accounts'}
            {mode === 'register' && 'Start your premium banking journey today'}
            {mode === 'recovery' && 'Enter your email to receive a reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="pl-10 h-11"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {mode !== 'recovery' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setMode('recovery')}
                      className="text-xs text-veridian-700 hover:text-veridian-800 font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 bg-veridian-900 hover:bg-veridian-950 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-veridian-900/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Link'}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="ml-1 text-veridian-700 hover:text-veridian-800 font-bold"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
