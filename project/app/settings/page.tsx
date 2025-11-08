'use client';

import { useTheme } from 'next-themes';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className={`flex min-h-screen ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar />
      <div className="flex-1">
        <TopBar title="Settings" subtitle="Adjust preferences for your EarthWise experience" />
        <main className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile */}
            <div className={`rounded-xl border p-6 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Profile</h2>
              <p className={`text-sm mb-4 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Update your basic information</p>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name" className={dark ? 'text-white' : ''}>Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    className={`mt-2 ${dark ? 'bg-slate-700 border-slate-600' : ''}`}
                    defaultValue="Alex Johnson"
                    aria-label="Full name input"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className={dark ? 'text-white' : ''}>Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className={`mt-2 ${dark ? 'bg-slate-700 border-slate-600' : ''}`}
                    defaultValue="alex@example.com"
                    aria-label="Email input"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className={dark ? 'text-white' : ''}>Location</Label>
                  <Input 
                    id="location" 
                    placeholder="City, Country" 
                    className={`mt-2 ${dark ? 'bg-slate-700 border-slate-600' : ''}`}
                    defaultValue="San Francisco, USA"
                    aria-label="Location input"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}