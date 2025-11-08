'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardCard from '@/components/DashboardCard';
import { Heart, Leaf } from 'lucide-react';
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

export default function TasksPage() {
  // Defaults (must match dashboard)
  const defaultHealth: Task[] = [
    { id: 'meditation', label: 'Morning meditation', points: 20, completed: false },
    { id: 'water', label: '8 glasses of water', points: 15, completed: false },
    { id: 'walk', label: '30-minute walk', points: 25, completed: false },
  ];
  const defaultEco: Task[] = [
    { id: 'bags', label: 'Use reusable bags', points: 10, completed: false },
    { id: 'bike', label: 'Bike instead of drive', points: 30, completed: false },
    { id: 'reduce-water', label: 'Reduce water usage', points: 20, completed: false },
  ];

  const [healthTasks, setHealthTasks] = useState<Task[]>(defaultHealth);
  const [ecoTasks, setEcoTasks] = useState<Task[]>(defaultEco);
  const [dailyLog, setDailyLog] = useState<DailyLog>({});

  const searchParams = useSearchParams();

  // Load state + daily reset just like dashboard
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

  // Derived + persistence
  const completedCountToday = useMemo(
    () => [...healthTasks, ...ecoTasks].filter(t => t.completed).length,
    [healthTasks, ecoTasks]
  );
  const todaysCompleted = completedCountToday >= DAILY_COMPLETION_THRESHOLD;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(healthTasks));
  }, [healthTasks]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ECO, JSON.stringify(ecoTasks));
  }, [ecoTasks]);

  useEffect(() => {
    const todayK = dateKey();
    setDailyLog(prev => {
      const next = { ...prev, [todayK]: todaysCompleted };
      const pruned = pruneLog(next);
      localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(pruned));
      return pruned;
    });
  }, [todaysCompleted]);

  // Toggle helpers
  function toggleTask(section: 'health' | 'eco', id: string) {
    const updater = (tasks: Task[]) =>
      tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    if (section === 'health') setHealthTasks(updater);
    else setEcoTasks(updater);
  }

  // Auto-scroll to section (from ?section=health|eco)
  useEffect(() => {
    const section = searchParams.get('section');
    if (!section) return;
    const el = document.getElementById(section);
    if (el) {
      // small timeout to ensure layout is painted
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      <div className="flex-1">
        <TopBar
          title="All Tasks"
          subtitle="View and manage all your Health & Eco tasks"
        />

        <main className="max-w-6xl mx-auto py-8 px-4 space-y-8">
          <DashboardCard
            title="Health Tasks"
            description="All wellness activities"
            icon={Heart}
            iconColor="text-pink-600"
            iconBgColor="bg-pink-100"
          >
            <div id="health" className="space-y-3 mt-4">
              {healthTasks.map(task => (
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
                  >
                    {task.completed ? 'Undo' : 'Complete'}
                  </Button>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Eco Tasks"
            description="All sustainability actions"
            icon={Leaf}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          >
            <div id="eco" className="space-y-3 mt-4">
              {ecoTasks.map(task => (
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
                  >
                    {task.completed ? 'Undo' : 'Complete'}
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
