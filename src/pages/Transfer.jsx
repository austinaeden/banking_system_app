import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Transfer({ accounts, onTransfer }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedAcc = accounts.find(a => a.id === formData.fromAccount);

  const handleNext = () => {
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }
    if (parseFloat(formData.amount) > (selectedAcc?.balance || 0)) {
      setError('Insufficient funds in selected account');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const success = await onTransfer({
      fromAccount: formData.fromAccount,
      toAccount: formData.toAccount,
      amount: parseFloat(formData.amount)
    });
    setLoading(false);
    if (success) setStep(3);
    else setError('Transfer failed. Please try again.');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step === 1 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800">Transfer Funds</CardTitle>
            <CardDescription>Move money between accounts or to external recipients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label>From Account</Label>
              <Select onValueChange={(v) => setFormData({...formData, fromAccount: v})}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.type} ({acc.accountNumber}) - ${acc.balance.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To Account / Recipient</Label>
              <Input 
                placeholder="Enter account number or email" 
                className="h-12"
                value={formData.toAccount}
                onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-12 text-lg font-semibold"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Note (Optional)</Label>
              <Input 
                placeholder="What's this for?" 
                className="h-12"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </div>

            <Button 
              onClick={handleNext}
              className="w-full h-12 bg-veridian-700 hover:bg-veridian-800 text-white rounded-xl text-lg font-semibold"
            >
              Review Transfer
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="glass-card border-veridian-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-veridian-100 text-veridian-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Confirm Transfer</CardTitle>
            <CardDescription>Please verify the details before proceeding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">From</span>
                <span className="font-semibold text-slate-900">{selectedAcc?.type} ({selectedAcc?.accountNumber})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">To</span>
                <span className="font-semibold text-slate-900">{formData.toAccount}</span>
              </div>
              <div className="h-px bg-slate-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Amount</span>
                <span className="text-2xl font-bold text-veridian-700">${parseFloat(formData.amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-xl"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] h-12 bg-veridian-700 hover:bg-veridian-800 text-white rounded-xl text-lg font-semibold"
              >
                {loading ? 'Processing...' : 'Confirm & Send'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="glass-card text-center py-12">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Transfer Successful!</h2>
              <p className="text-slate-500">Your funds are on the way to {formData.toAccount}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl inline-block">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Transaction ID</p>
              <p className="font-mono text-slate-700">VRD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div className="pt-6">
              <Button 
                onClick={() => {
                  setStep(1);
                  setFormData({ fromAccount: '', toAccount: '', amount: '', note: '' });
                }}
                className="bg-veridian-700 hover:bg-veridian-800 text-white rounded-xl px-8"
              >
                Make Another Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
