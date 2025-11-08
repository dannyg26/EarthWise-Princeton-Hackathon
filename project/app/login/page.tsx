'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);

  // --- Auto-redirect if already authenticated ---
  useEffect(() => {
    let isMounted = true;

    // Prefetch dashboard for snappier redirects
    router.prefetch?.('/app/dashboard');

    // 1) Immediate session check
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        // Not fatal; just log
        console.warn('getSession error:', error.message);
      }
      if (data?.session) {
        router.replace('/app/dashboard');
      }
    })();

    // 2) Subscribe to auth changes (if user signs in on another tab, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session) {
        router.replace('/app/dashboard');
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  const show = (type: 'success' | 'error' | 'info', text: string) => {
    setMessageType(type);
    setMessage(text);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      show('error', 'Please enter email and password.');
      return;
    }
    setLoadingSignUp(true);
    setMessage(null);

    try {
      // Optional UI guard: check if this email is already in profiles
      const { data: existingUser, error: existingError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingError) {
        // Not fatal—profiles table might have RLS; still allow sign-up to proceed
        console.warn('profiles check (signUp) error:', existingError.message);
      }

      if (existingUser) {
        show('info', 'Account already exists. Please sign in instead.');
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('Error signing up:', error.message);
        show('error', error.message || 'Signup failed. Try again.');
        return;
      }

      // If email confirmation is enabled, there may be no session yet.
      // Best-effort: create profile row if we already have a user id.
      const userId = data.user?.id;
      if (userId) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, email }])
          .single();

        if (insertError) {
          // Not fatal; you might also have a DB trigger to upsert profiles.
          console.warn('Error adding to profiles:', insertError.message);
        }
      }

      show(
        'success',
        data.session
          ? "You're signed up!"
          : 'Check your email to confirm your account.'
      );

      // If a session exists immediately (depends on your Supabase auth settings),
      // the onAuthStateChange above will auto-redirect.
      if (data.session) {
        router.replace('/app/dashboard');
      }
    } finally {
      setLoadingSignUp(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      show('error', 'Please enter email and password.');
      return;
    }
    setLoadingSignIn(true);
    setMessage(null);

    try {
      // Optional UX: verify email exists in profiles (can be skipped if RLS blocks anon read)
      const { data: existingUser, error: existingError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingError) {
        console.warn('profiles check (signIn) error:', existingError.message);
      }

      if (!existingUser) {
        show('info', 'Email not recognized. Would you like to sign up?');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error.message);
        show('error', 'Incorrect password or failed login.');
        return;
      }

      show('success', 'Login successful!');
      // onAuthStateChange will also catch this, but we can push eagerly:
      router.replace('/app/dashboard');
    } finally {
      setLoadingSignIn(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to sign-in on Enter
    handleSignIn();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-900">Welcome</h1>
        <p className="text-sm text-slate-600">
          Sign in to continue, or create a new account.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={loadingSignIn || loadingSignUp}
            >
              {loadingSignIn ? 'Signing In…' : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleSignUp}
              disabled={loadingSignIn || loadingSignUp}
            >
              {loadingSignUp ? 'Signing Up…' : 'Sign Up'}
            </Button>
          </div>
        </form>

        {message && (
          <p
            className={
              'mt-2 text-center text-sm ' +
              (messageType === 'success'
                ? 'text-emerald-600'
                : messageType === 'error'
                ? 'text-red-600'
                : 'text-slate-600')
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
