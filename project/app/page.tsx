'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Leaf,
  Heart,
  TrendingUp,
  Sparkles,
  Recycle,
  Droplets,
  Sun,
  Wind,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* Small helper to rotate floating badge items */
function BadgeRotator({
  items,
  className = '',
  intervalMs = 4200,
  floatY = 10,
  floatDuration = 9,
}: {
  items: { icon: React.ReactNode; label: string }[];
  className?: string;
  intervalMs?: number;
  floatY?: number;
  floatDuration?: number;
}) {
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, items.length]);

  const current = items[i];

  return (
    <motion.div
      className={`fixed z-10 pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        animate={{ y: [0, -floatY, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center rounded-full border bg-white/70 px-3 py-1.5 text-slate-700 shadow-sm backdrop-blur-sm border-white/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center"
            >
              {current.icon}
              <span className="ml-2 text-xs font-medium">{current.label}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health Goals',
      desc: 'Track wellness habits and build sustainable routines for better health.',
      delay: 0.05,
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Eco Actions',
      desc: 'Make a positive impact with daily eco-friendly challenges and tips.',
      delay: 0.1,
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Progress Tracking',
      desc: 'Visualize your journey with streaks, points, and achievements.',
      delay: 0.15,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* --- Background layers --- */}
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute inset-0 -z-10 gradient-wash" />
      <div className="pointer-events-none absolute -z-10 blur-3xl">
        <div className="blob blob-green" />
        <div className="blob blob-emerald" />
        <div className="blob blob-sky" />
      </div>

      {/* Floating rotating badges */}
      <BadgeRotator
        className="top-28 left-6 md:top-24 md:left-16"
        items={[
          { icon: <Leaf className="w-4 h-4 text-emerald-600" />, label: 'Low Waste' },
          { icon: <Recycle className="w-4 h-4 text-emerald-600" />, label: 'Plastic-Free' },
          { icon: <Droplets className="w-4 h-4 text-emerald-600" />, label: 'Save Water' },
        ]}
        intervalMs={4200}
        floatY={10}
        floatDuration={9}
      />

      <BadgeRotator
        className="bottom-24 right-6 md:bottom-20 md:right-16"
        items={[
          { icon: <Sparkles className="w-4 h-4 text-emerald-600" />, label: 'Mindful Minutes' },
          { icon: <Sun className="w-4 h-4 text-amber-500" />, label: 'Solar Power' },
          { icon: <Wind className="w-4 h-4 text-sky-500" />, label: 'Bike to Work' },
        ]}
        intervalMs={4800}
        floatY={12}
        floatDuration={10}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Brand */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center rounded-full border bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md border-white/40">
            <Leaf className="w-7 h-7 text-green-600" />
            <span className="ml-2 text-xl font-semibold tracking-tight text-slate-900">
              EarthWise Coach
            </span>
          </div>
        </motion.div>

        {/* Hero */}
        <div className="text-center">
          <motion.h1
            className="mx-auto max-w-3xl bg-clip-text text-transparent text-5xl font-bold leading-tight sm:text-6xl"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #059669, #10b981, #34d399, #22d3ee, #059669)',
              backgroundSize: '200% 100%',
              animation: 'gradx 10s ease-in-out infinite',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Live Better,
            <br />
            Live Greener
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-2xl text-balance text-lg text-slate-700"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
          >
            Your personal AI coach for sustainable living and holistic wellness. Track habits,
            earn points, and transform your lifestyle one task at a time.
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              style={{
                backgroundImage: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
                backgroundSize: '160% 100%',
                boxShadow: '0 10px 30px rgba(16,185,129,0.25)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget.style.backgroundPosition = '100% 0');
                (e.currentTarget.style.transform = 'translateY(-1px)');
                (e.currentTarget.style.boxShadow = '0 14px 34px rgba(16,185,129,0.35)');
              }}
              onMouseLeave={(e) => {
                (e.currentTarget.style.backgroundPosition = '0 0');
                (e.currentTarget.style.transform = 'translateY(0)');
                (e.currentTarget.style.boxShadow = '0 10px 30px rgba(16,185,129,0.25)');
              }}
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: f.delay }}
              className="relative overflow-hidden rounded-2xl border bg-white/70 p-8 shadow-lg backdrop-blur-sm border-white/40"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-emerald-100/70 p-3">
                <div className="text-green-600">{f.icon}</div>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-slate-600">{f.desc}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="pt-10 text-center text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Built with mindfulness for the planet—and you.
        </motion.p>
      </div>

      {/* Background & text gradient keyframes (scoped) */}
      <style jsx global>{`
        /* Motion-safe */
        @media (prefers-reduced-motion: reduce) {
          .blob, .gradient-wash { animation: none !important; }
        }

        /* Subtle grid */
        .grid-bg {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(2, 6, 23, 0.08) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(2, 6, 23, 0.05) 1px, transparent 0);
          background-size: 26px 26px, 52px 52px;
          background-position: 0 0, 13px 13px;
        }

        /* Soft animated gradient wash */
        .gradient-wash {
          pointer-events: none;
          background:
            radial-gradient(60% 60% at 50% 18%, rgba(16,185,129,0.14) 0%, transparent 60%),
            radial-gradient(42% 42% at 82% 70%, rgba(59,130,246,0.10) 0%, transparent 60%);
          animation: wash 12s linear infinite alternate;
        }
        @keyframes wash {
          0%   { transform: translateY(0px);   opacity: 1; }
          100% { transform: translateY(10px); opacity: 1; }
        }

        /* Color blobs */
        .blob {
          position: absolute;
          width: 28rem;
          height: 28rem;
          border-radius: 9999px;
          filter: blur(52px);
          opacity: 0.35;
          animation: blob-float 20s ease-in-out infinite;
          transform: translateZ(0);
        }
        .blob-green  { background: radial-gradient(circle at 30% 30%, #22c55e, transparent 60%); top: -8rem; left: -6rem; }
        .blob-emerald{ background: radial-gradient(circle at 70% 40%, #10b981, transparent 60%); top: 35vh; right: -10rem; animation-delay: 2.2s; }
        .blob-sky    { background: radial-gradient(circle at 50% 50%, #38bdf8, transparent 60%); bottom: -10rem; left: 15%; animation-delay: 4.1s; }

        @keyframes blob-float {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(18px, -14px) scale(1.03); }
          66%  { transform: translate(-14px, 10px) scale(0.985); }
          100% { transform: translate(0, 0) scale(1); }
        }

        /* Animated text gradient */
        @keyframes gradx {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>
  );
}
