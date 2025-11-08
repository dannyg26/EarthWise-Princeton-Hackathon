'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Leaf,
  Heart,
  Recycle,
  Brain,
  Rocket,
  Sparkles,
  DollarSign,
  Stethoscope,
  Users,
} from 'lucide-react';

export default function AboutPage() {
  const tracks = [
    {
      icon: <Stethoscope className="w-5 h-5" />,
      title: 'Healthcare',
      desc:
        'Promote exercise, nutrition, and mental health through an AI wellness coach.',
    },
    {
      icon: <Recycle className="w-5 h-5" />,
      title: 'Sustainability',
      desc:
        'Nudge daily eco-friendly behaviors like recycling, biking, and saving energy.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Education & Entertainment',
      desc:
        'Make self-improvement a game with streaks, points, and adaptive coaching.',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Business',
      desc:
        'Tie greener spending and personal goals to meaningful rewards and insights.',
    },
  ];

  const specialTracks = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Amazon's AI Innovation",
      desc:
        'Core experience uses an AI assistant to generate personalized tasks and tips.',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Capital One's Financial Hack",
      desc:
        'Analyze spending and suggest greener swaps (e.g., transit over rideshare).',
    },
    {
      icon: <Stethoscope className="w-5 h-5" />,
      title: 'Dedalus Labs APIs',
      desc:
        'Optional health integrations (where available) to personalize wellness nudges.',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Photon's Hybrid Intelligence",
      desc:
        'Human + AI collaboration: users set goals; AI adapts and co-plans progress.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center rounded-full border bg-white/70 px-4 py-2 shadow-sm backdrop-blur border-white/50">
            <Leaf className="w-6 h-6 text-green-600" />
            <span className="ml-2 text-lg font-semibold text-slate-900">
              About EarthWise
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Wellness meets Sustainability—guided by AI
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-slate-700">
            EarthWise is a web platform that blends personal wellness with environmental
            sustainability via an AI-driven life coach. It helps users build healthy habits
            (exercise, nutrition, mental health) and eco-friendly practices (recycling,
            saving energy) in a fun, gamified way.
          </p>
        </motion.div>

        {/* Why it’s unique */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-12 rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur border-white/60"
        >
          <div className="flex items-start gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Heart className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Why it’s unique</h2>
              <p className="mt-2 text-slate-700">
                EarthWise turns improving <em>your life and the planet</em> into a collaborative
                game with AI. Example prompt: “Walk or bike to work this week instead of driving —
                you’ll burn calories and cut carbon! 📉🌳”. Users earn points or charitable rewards,
                while the AI adapts to preferences. This creative fusion addresses two common
                problems (health habits and climate action) in one experience—an “ah-ha” moment for
                users and judges alike. The web app is accessible on any device, and with low-code
                tools plus AI assistance, it’s realistically buildable in a 36-hour hackathon.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Multi-track fit */}
        <section className="mt-12">
          <h3 className="text-lg font-semibold text-slate-900">
            Fits multiple HackPrinceton tracks
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {tracks.map((t) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35 }}
                className="flex items-start gap-3 rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur border-white/60"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-green-700">
                  {t.icon}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{t.title}</h4>
                  <p className="text-sm text-slate-600">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sponsor special tracks */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold text-slate-900">Sponsor Special Tracks</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {specialTracks.map((s) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35 }}
                className="flex items-start gap-3 rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur border-white/60"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-green-700">
                  {s.icon}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{s.title}</h4>
                  <p className="text-sm text-slate-600">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Example & CTA */}
        <section className="mt-12 rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur border-white/60">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">How it feels to use</h3>
              <p className="mt-2 text-slate-700">
                The AI suggests small, high-leverage actions (e.g., “Swap one drive this week
                for a bike ride”), then rewards momentum with points, streaks, and optional
                donations—to keep progress intrinsically and extrinsically motivating.
              </p>
            </div>
            <div className="shrink-0">
              <Button asChild className="px-6">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footnotes */}
        <p className="mt-8 text-xs leading-relaxed text-slate-500">
          [1] HackPrinceton tracks; [2] Amazon AI Innovation; [3] Capital One financial hack;
          [4] Dedalus Labs APIs; [5] “Ah-ha” factor (distinctiveness).
        </p>
      </div>
    </div>
  );
}
