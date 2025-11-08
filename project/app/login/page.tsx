'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) console.error('Error signing up:', error.message)
    else console.log('Sign up successful:', data)
  }

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) console.error('Error signing in:', error.message)
    else console.log('Sign in successful:', data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 space-y-4 rounded-lg border p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={handleSignIn} className="flex-1">
            Sign In
          </Button>
          <Button onClick={handleSignUp} variant="outline" className="flex-1">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}
