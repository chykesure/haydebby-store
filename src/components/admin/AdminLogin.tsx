'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Mail, Lock, Store } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export default function AdminLogin() {
  const setView = useAppStore((s) => s.setView);
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
      }
      // If successful, the AdminPanel will re-render with the session
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1A9B8C 0%, #158A7A 50%, #0F7A6C 100%)',
      }}
    >
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo.png"
                alt="hay•debby"
                width={140}
                height={50}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            <CardTitle className="text-xl" style={{ color: '#212121' }}>
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-gray-500">
              Sign in with your admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@haydebby.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
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
                className="w-full text-white font-semibold py-5"
                style={{ backgroundColor: '#1A9B8C' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In to Admin'
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView('store')}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Store className="h-4 w-4" />
                  Back to Store
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
