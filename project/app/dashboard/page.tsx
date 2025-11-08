'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardCard from '@/components/DashboardCard';
import { Heart, Leaf, TrendingUp, Flame, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      <div className="flex-1">
        <TopBar
          title="Dashboard"
          subtitle="Track your progress and stay motivated"
        />

        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Today's Points</p>
                  <p className="text-3xl font-bold text-slate-900">240</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-slate-900">12 days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">87</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DashboardCard
              title="Health Tasks"
              description="Complete your daily wellness activities"
              icon={Heart}
              iconColor="text-pink-600"
              iconBgColor="bg-pink-100"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Morning meditation</span>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">8 glasses of water</span>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">30-minute walk</span>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
              </div>
              <Button className="w-full mt-4" variant="ghost">View All Health Tasks</Button>
            </DashboardCard>

            <DashboardCard
              title="Eco Tasks"
              description="Make a positive environmental impact today"
              icon={Leaf}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            >
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Use reusable bags</span>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Bike instead of drive</span>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Reduce water usage</span>
                  <Button size="sm" variant="outline">Complete</Button>
                </div>
              </div>
              <Button className="w-full mt-4" variant="ghost">View All Eco Tasks</Button>
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
}
