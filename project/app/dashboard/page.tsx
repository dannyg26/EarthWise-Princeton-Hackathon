'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardCard from '@/components/DashboardCard';
import { Heart, Leaf, TrendingUp, Flame, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Task = {
  id: string;
  label: string;
  points: number;
  completed: boolean;
};

type DailyLog = Record<string, boolean>; // YYYY-MM-DD -> completed?

// ---------- Config ----------
const BASE_POINTS = 240;                 // baseline points
const BASE_TOTAL_TASKS = 12;             // <-- start Total Tasks at 12
const DAILY_COMPLETION_THRESHOLD = 1;    // how many tasks must be completed to count the day
const STORAGE_KEYS = {
  HEALTH: 'ew_healthTasks_v1',
  ECO: 'ew_ecoTasks_v1',
  LOG: 'ew_dailyLog_v1',
  LAST_OPEN: 'ew_lastOpenDate_v1',
} as const;

// ---------- Date helpers (local time) ----------
function dateKey(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // YYYY-MM-DD
}
function addDays(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta);
}

// Compute a streak that ends today if today is completed, otherwise ends yesterday.
function computeStreak(log: DailyLog): number {
  const today = new Date();
  let streak = 0;

  const todayKey = dateKey(today);
  let cursor = new Date(today);

  if (log[todayKey]) {
    streak += 1;
    cursor = addDays(cursor, -1);
  } else {
    cursor = addDays(cursor, -1);
  }

  while (log[dateKey(cursor)]) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Keep the daily log small
function pruneLog(log: DailyLog, keepDays = 60): DailyLog {
  const today = new Date();
  const kept: DailyLog = {};
  for (let i = 0; i < keepDays; i++) {
    const k = dateKey(addDays(today, -i));
    if (k in log) kept[k] = log[k];
  }
  return kept;
}

export default function DashboardPage() {
  // ---------- Defaults ----------
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

  // ---------- State ----------
  const [healthTasks, setHealthTasks] = useState<Task[]>(defaultHealth);
  const [ecoTasks, setEcoTasks] = useState<Task[]>(defaultEco);
  const [dailyLog, setDailyLog] = useState<DailyLog>({});

  // ---------- Load persisted state ----------
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

      // If new day since last visit, reset today's tasks to unchecked
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

  // ---------- Derived values ----------
  const completedCountToday = useMemo(
    () => [...healthTasks, ...ecoTasks].filter(t => t.completed).length,
    [healthTasks, ecoTasks]
  );

  const todaysCompleted = completedCountToday >= DAILY_COMPLETION_THRESHOLD;

  const todaysPoints = useMemo(() => {
    const extra = [...healthTasks, ...ecoTasks].reduce(
      (sum, t) => sum + (t.completed ? t.points : 0),
      0
    );
    return BASE_POINTS + extra;
  }, [healthTasks, ecoTasks]);

  // Total Tasks starts at 12 and increases/decreases with Complete/Undo today
  const totalTasksDisplay = useMemo(
    () => BASE_TOTAL_TASKS + completedCountToday,
    [completedCountToday]
  );

  const currentStreak = useMemo(() => computeStreak(dailyLog), [dailyLog]);

  // ---------- Persist tasks ----------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(healthTasks));
  }, [healthTasks]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ECO, JSON.stringify(ecoTasks));
  }, [ecoTasks]);

  // ---------- Update today's completion in the daily log ----------
  useEffect(() => {
    const todayK = dateKey();
    setDailyLog(prev => {
      const next = { ...prev, [todayK]: todaysCompleted };
      const pruned = pruneLog(next);
      localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(pruned));
      return pruned;
    });
  }, [todaysCompleted]);

  // ---------- Toggle helpers ----------
  function toggleTask(section: 'health' | 'eco', id: string) {
    const updater = (tasks: Task[]) =>
      tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));

    if (section === 'health') {
      setHealthTasks(updater);
    } else {
      setEcoTasks(updater);
    }
  }

  // ---------- UI ----------
  const streakLabel = `${currentStreak} day${currentStreak === 1 ? '' : 's'}`;
  const streakActive = dailyLog[dateKey()] === true;

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
            {/* Today's Points */}
            <div className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Today's Points</p>
                  <p className="text-3xl font-bold text-slate-900">{todaysPoints}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-slate-900">{streakLabel}</p>
                  <p className="text-xs mt-1 text-slate-500">
                    {streakActive ? 'Today counts toward your streak.' : 'Complete at least one task today to keep it going.'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${streakActive ? 'bg-orange-100' : 'bg-slate-100'}`}>
                  <Flame className={`w-6 h-6 ${streakActive ? 'text-orange-600' : 'text-slate-400'}`} />
                </div>
              </div>
            </div>

            {/* Total Tasks (dynamic from 12 + today's completions) */}
            <div className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">{totalTasksDisplay}</p>
                  <p className="text-xs mt-1 text-slate-500">
                    Starts at {BASE_TOTAL_TASKS}; updates with today’s Complete/Undo.
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DashboardCard
              title="Health Tasks"
              description="Complete your daily wellness activities"
              icon={Heart}
              iconColor="text-pink-600"
              iconBgColor="bg-pink-100"
            >
              <div className="space-y-3 mt-4">
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
              <Button className="w-full mt-4" variant="ghost" asChild>
                <Link href="/tasks?section=health">View All Health Tasks</Link>
              </Button>
            </DashboardCard>

            <DashboardCard
              title="Eco Tasks"
              description="Make a positive environmental impact today"
              icon={Leaf}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            >
              <div className="space-y-3 mt-4">
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
              <Button className="w-full mt-4" variant="ghost" asChild>
                <Link href="/tasks?section=eco">View All Eco Tasks</Link>
              </Button>
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
}
