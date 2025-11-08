'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <TopBar
          title="Settings"
          subtitle="Manage your account and preferences"
        />

        <main className="p-8">
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="mt-2"
                      defaultValue="Alex Johnson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="mt-2"
                      defaultValue="alex@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      className="mt-2"
                      defaultValue="San Francisco, USA"
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Daily Reminders</p>
                      <p className="text-sm text-slate-600">Get notified about your daily tasks</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Weekly Reports</p>
                      <p className="text-sm text-slate-600">Receive your progress summary</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Coaching Tips</p>
                      <p className="text-sm text-slate-600">Get personalized wellness tips</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="goal">Daily Point Goal</Label>
                    <Input
                      id="goal"
                      type="number"
                      placeholder="100"
                      className="mt-2"
                      defaultValue="150"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Dark Mode</p>
                      <p className="text-sm text-slate-600">Toggle dark mode theme</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
