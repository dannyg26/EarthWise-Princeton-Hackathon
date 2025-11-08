'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardCard from '@/components/DashboardCard';
import { Heart, Leaf, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Task = {
  id: string;
  label: string;
  points: number;
  completed: boolean;
};

type DailyLog = Record<string, boolean>; // YYYY-MM-DD -> completed?

// ---------- Config (must match dashboard) ----------
const DAILY_COMPLETION_THRESHOLD = 1;
const STORAGE_KEYS = {
  HEALTH: 'ew_healthTasks_v1',
  ECO: 'ew_ecoTasks_v1',
  LOG: 'ew_dailyLog_v1',
  LAST_OPEN: 'ew_lastOpenDate_v1',
} as const;

// ---------- Date helpers ----------
function dateKey(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function addDays(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta);
}
function pruneLog(log: DailyLog, keepDays = 60): DailyLog {
  const today = new Date();
  const kept: DailyLog = {};
  for (let i = 0; i < keepDays; i++) {
    const k = dateKey(addDays(today, -i));
    if (k in log) kept[k] = log[k];
  }
  return kept;
}
function formatNice(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function TasksPage() {
  // ---------- Shared defaults (must match dashboard) ----------
  const defaultHealth: Task[] = [
    { id: 'yoga-20',            label: '20-minute yoga',                      points: 20, completed: false },
    { id: 'strength-15',        label: '15-minute strength training',         points: 25, completed: false },
    { id: 'intervals-10',       label: '10-minute intervals',                 points: 20, completed: false },
    { id: 'healthy-breakfast',  label: 'Healthy breakfast (protein + fruit)', points: 15, completed: false },
    { id: 'steps-8000',         label: '8,000 steps',                          points: 25, completed: false },
    { id: 'sleep-8h',           label: 'Sleep 8 hours',                        points: 30, completed: false },
    { id: 'screen-breaks',      label: 'Screen breaks every hour',             points: 10, completed: false },
    { id: 'journaling-5',       label: '5-minute journaling',                  points: 10, completed: false },
    { id: 'breathing-3',        label: '3-minute breathing exercise',          points: 10, completed: false },
    { id: 'posture-x3',         label: 'Posture check ×3',                     points: 5,  completed: false },
  ];

  const defaultEco: Task[] = [
    { id: 'meatless-meal',          label: 'Meatless meal',                         points: 25, completed: false },
    { id: 'cold-wash-laundry',      label: 'Cold-wash laundry',                     points: 15, completed: false },
    { id: 'short-shower-5',         label: '5-minute shower',                       points: 15, completed: false },
    { id: 'unplug-standby',         label: 'Unplug idle devices',                   points: 10, completed: false },
    { id: 'thermostat-1deg',        label: 'Thermostat ±1°F adjustment',            points: 15, completed: false },
    { id: 'reusable-mug-bottle',    label: 'Bring reusable mug/bottle',             points: 10, completed: false },
    { id: 'recycle-sort',           label: 'Sort & recycle properly',               points: 10, completed: false },
    { id: 'compost-scraps',         label: 'Compost food scraps',                   points: 20, completed: false },
    { id: 'public-transit-carpool', label: 'Use public transit or carpool',         points: 30, completed: false },
    { id: 'no-single-use-plastic',  label: 'No single-use plastic today',           points: 25, completed: false },
  ];

  // ---------- State ----------
  const [healthTasks, setHealthTasks] = useState<Task[]>(defaultHealth);
  const [ecoTasks, setEcoTasks] = useState<Task[]>(defaultEco);
  const [dailyLog, setDailyLog] = useState<DailyLog>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  // View selector: today (default) or tomorrow (preview)
  const viewingTomorrow = (searchParams.get('when') || '').toLowerCase() === 'tomorrow';
  const today = new Date();
  const tomorrow = addDays(today, 1);

  // ---------- Load state + daily reset (match dashboard) ----------
  useEffect(() => {
    try {
      const hRaw = localStorage.getItem(STORAGE_KEYS.HEALTH);
      const eRaw = localStorage.getItem(STORAGE_KEYS.ECO);
      const logRaw = localStorage.getItem(STORAGE_KEYS.LOG);
      const lastOpenRaw = localStorage.getItem(STORAGE_KEYS.LAST_OPEN);

      const h = hRaw ? (JSON.parse(hRaw) as Task[]) : defaultHealth;
      const e = eRaw ? (JSON.parse(eRaw) as Task[]) : defaultEco;
      const log = logRaw ? (JSON.parse(logRaw) as DailyLog) : {};

      const todayK = dateKey();

      if (lastOpenRaw && lastOpenRaw !== todayK) {
        const reset = (tasks: Task[]) => tasks.map(t => ({ ...t, completed: false }));
        setHealthTasks(reset(h));
        setEcoTasks(reset(e));
      } else {
        setHealthTasks(h);
        setEcoTasks(e);
      }

      setDailyLog(pruneLog(log));
      localStorage.setItem(STORAGE_KEYS.LAST_OPEN, todayK);
    } catch {
      setHealthTasks(defaultHealth);
      setEcoTasks(defaultEco);
      setDailyLog({});
      localStorage.setItem(STORAGE_KEYS.LAST_OPEN, dateKey());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Derived (today only) ----------
  const completedCountToday = useMemo(
    () => [...healthTasks, ...ecoTasks].filter(t => t.completed).length,
    [healthTasks, ecoTasks]
  );
  const todaysCompleted = completedCountToday >= DAILY_COMPLETION_THRESHOLD;

  // ---------- Persist task state and sync with dashboard ----------
  // Sync tasks state from localStorage when it changes in other pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (viewingTomorrow) return; // don't sync if viewing tomorrow's preview
      if (e.key === STORAGE_KEYS.HEALTH) {
        const newTasks = e.newValue ? JSON.parse(e.newValue) : defaultHealth;
        setHealthTasks(newTasks);
      } else if (e.key === STORAGE_KEYS.ECO) {
        const newTasks = e.newValue ? JSON.parse(e.newValue) : defaultEco;
        setEcoTasks(newTasks);
      }
    };

    // Handle custom events for same-window updates
    // (no same-window custom event handler; rely on storage events)

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [viewingTomorrow]);

  // Save current tasks state to localStorage
  useEffect(() => {
    if (!viewingTomorrow) { // only save if not in preview mode
      localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(healthTasks));
    }
  }, [healthTasks, viewingTomorrow]);
  useEffect(() => {
    if (!viewingTomorrow) { // only save if not in preview mode
      localStorage.setItem(STORAGE_KEYS.ECO, JSON.stringify(ecoTasks));
    }
  }, [ecoTasks, viewingTomorrow]);

  // ---------- Update daily log (today only) ----------
  useEffect(() => {
    const todayK = dateKey();
    setDailyLog(prev => {
      const next = { ...prev, [todayK]: todaysCompleted };
      const pruned = pruneLog(next);
      localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(pruned));
      return pruned;
    });
  }, [todaysCompleted]);

  // ---------- Toggle helpers (disabled in tomorrow preview) ----------
  function toggleTask(section: 'health' | 'eco', id: string) {
    if (viewingTomorrow) return; // lock in preview mode
    const applyToggle = (tasks: Task[]) => tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    if (section === 'health') {
      const updated = applyToggle(healthTasks);
      setHealthTasks(updated);
    } else {
      const updated = applyToggle(ecoTasks);
      setEcoTasks(updated);
    }
  }

  // ---------- Displayed lists ----------
  const displayedHealth = useMemo(
    () => (viewingTomorrow ? healthTasks.map(t => ({ ...t, completed: false })) : healthTasks),
    [healthTasks, viewingTomorrow]
  );
  const displayedEco = useMemo(
    () => (viewingTomorrow ? ecoTasks.map(t => ({ ...t, completed: false })) : ecoTasks),
    [ecoTasks, viewingTomorrow]
  );

  // ---------- Auto-scroll to section (from ?section=health|eco) ----------
  useEffect(() => {
    const section = searchParams.get('section');
    if (!section) return;
    const el = document.getElementById(section);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [searchParams]);

  // ---------- Switcher helpers ----------
  function setWhen(when: 'today' | 'tomorrow') {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (when === 'tomorrow') params.set('when', 'tomorrow');
    else params.delete('when');
    router.replace(`/tasks?${params.toString()}`);
  }

  const subTitle = viewingTomorrow
    ? `Preview of tomorrow's tasks (${formatNice(tomorrow)})`
    : `View and manage today's Health & Eco tasks (${formatNice(today)})`;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      <div className="flex-1">
        <TopBar title="All Tasks" subtitle={subTitle} />

        <main className="max-w-6xl mx-auto py-8 px-4 space-y-8">
          {/* View switcher */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm font-medium">
                {viewingTomorrow ? 'Tomorrow (preview)' : 'Today'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewingTomorrow ? 'outline' : 'default'}
                size="sm"
                onClick={() => setWhen('today')}
              >
                Today
              </Button>
              <Button
                variant={viewingTomorrow ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWhen('tomorrow')}
              >
                Tomorrow
              </Button>
            </div>
          </div>

          {/* Health */}
          <DashboardCard
            title="Health Tasks"
            description={viewingTomorrow ? "What you'll see tomorrow" : 'All wellness activities'}
            icon={Heart}
            iconColor="text-pink-600"
            iconBgColor="bg-pink-100"
          >
            <div id="health" className="space-y-3 mt-4">
              {displayedHealth.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-sm text-slate-700">
                    {task.label}
                    <span className="ml-2 text-xs text-slate-500">(+{task.points})</span>
                  </span>
                  <Button
                    size="sm"
                    variant={task.completed ? 'default' : 'outline'}
                    onClick={() => toggleTask('health', task.id)}
                    disabled={viewingTomorrow}
                    title={viewingTomorrow ? 'Available tomorrow' : task.completed ? 'Undo' : 'Complete'}
                  >
                    {viewingTomorrow ? 'Locked' : task.completed ? 'Undo' : 'Complete'}
                  </Button>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Eco */}
          <DashboardCard
            title="Eco Tasks"
            description={viewingTomorrow ? "What you'll see tomorrow" : 'All sustainability actions'}
            icon={Leaf}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          >
            <div id="eco" className="space-y-3 mt-4">
              {displayedEco.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-sm text-slate-700">
                    {task.label}
                    <span className="ml-2 text-xs text-slate-500">(+{task.points})</span>
                  </span>
                  <Button
                    size="sm"
                    variant={task.completed ? 'default' : 'outline'}
                    onClick={() => toggleTask('eco', task.id)}
                    disabled={viewingTomorrow}
                    title={viewingTomorrow ? 'Available tomorrow' : task.completed ? 'Undo' : 'Complete'}
                  >
                    {viewingTomorrow ? 'Locked' : task.completed ? 'Undo' : 'Complete'}
                  </Button>
                </div>
              ))}
            </div>
          </DashboardCard>
        </main>
      </div>
    </div>
  );
}
