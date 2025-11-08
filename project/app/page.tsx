'use client';

import { Button } from '@/components/ui/button';
import { Leaf, Heart, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Leaf className="w-10 h-10 text-green-600" />
              <span className="text-3xl font-bold text-slate-900">EcoLife Coach</span>
            </div>
          </div>

          <h1 className="text-6xl font-bold text-slate-900 leading-tight">
            Live Better,
            <br />
            <span className="text-green-600">Live Greener</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your personal AI coach for sustainable living and holistic wellness.
            Track habits, earn points, and transform your lifestyle one task at a time.
          </p>

          <div className="pt-6">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Health Goals</h3>
              <p className="text-slate-600">
                Track wellness habits and build sustainable routines for better health.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Eco Actions</h3>
              <p className="text-slate-600">
                Make a positive impact with daily eco-friendly challenges and tips.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Progress Tracking</h3>
              <p className="text-slate-600">
                Visualize your journey with streaks, points, and achievements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
