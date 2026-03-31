'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginDialog({
  open,
  onClose,
  onSwitchToRegister,
}: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        setEmail('');
        setPassword('');
        onClose();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-xl" style={{ color: '#212121' }}>
            Welcome Back
          </DialogTitle>
          <DialogDescription>
            Sign in to your hay•debby account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold"
            style={{ backgroundColor: '#1A9B8C' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="font-semibold hover:underline"
              style={{ color: '#1A9B8C' }}
            >
              Register
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
