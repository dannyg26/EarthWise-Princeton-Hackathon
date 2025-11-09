'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

type Level = 'success' | 'info' | 'warning' | 'error';

type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  timestamp: string; // ISO
  unread: boolean;
  href?: string;
  level?: Level;
};

declare global {
  interface WindowEventMap {
    notify: CustomEvent<{
      title: string;
      description?: string;
      href?: string;
      level?: Level;
    }>;
  }
}

const LS_KEY = 'EW_NOTIFICATIONS_V1';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Streak alive!',
    description: 'Nice work — you completed at least one task today. +25 pts',
    timestamp: new Date().toISOString(),
    unread: true,
    level: 'success',
  },
  {
    id: 'n-2',
    title: 'New eco tip',
    description: 'Try a 5-minute shower to save water and energy.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread: true,
    level: 'info',
  },
];

function loadFromStorage(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as NotificationItem[];
  } catch {}
  return DEFAULT_NOTIFICATIONS;
}

function saveToStorage(items: NotificationItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

const STRIPE_WIDTH = 340;
const ENTER_MS = 300;
const HOLD_MS = 2200;
const EXIT_MS = 300;

const levelStripe: Record<Level, string> = {
  success: 'bg-emerald-500',
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
};

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const unreadCount = items.filter((n) => n.unread).length;

  const queueRef = React.useRef<NotificationItem[]>([]);
  const [activeToast, setActiveToast] = React.useState<NotificationItem | null>(null);

  React.useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  React.useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };
  const markOneAsRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const pumpStripe = React.useCallback(() => {
    if (activeToast) return;
    const next = queueRef.current.shift();
    if (!next) return;

    setActiveToast(next);

    const t1 = setTimeout(() => {
      setActiveToast((cur) => cur);
    }, ENTER_MS + HOLD_MS);

    const t2 = setTimeout(() => {
      setActiveToast(null);
      pumpStripe();
    }, ENTER_MS + HOLD_MS + EXIT_MS + 60);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeToast]);

  React.useEffect(() => {
    const onNotify = (e: WindowEventMap['notify']) => {
      const d = e.detail || {};
      const item: NotificationItem = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: d.title ?? 'Notification',
        description: d.description,
        timestamp: new Date().toISOString(),
        unread: true,
        href: d.href,
        level: d.level ?? 'success',
      };

      setItems((prev) => [item, ...prev]);

      queueRef.current.push(item);
      pumpStripe();
    };

    window.addEventListener('notify', onNotify as EventListener);
    return () => window.removeEventListener('notify', onNotify as EventListener);
  }, [pumpStripe]);

  return (
    <div className="relative bg-white/40 backdrop-blur-md border-b border-slate-200/30 px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
        </div>

        <div className="relative flex items-center gap-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="notify-btn"
                data-testid="notify-btn"
                aria-label="Open notifications"
                aria-haspopup="dialog"
                aria-expanded={open}
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-600 ring-2 ring-white" />
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0 shadow-lg" sideOffset={8}>
              <div className="flex items-center justify-between border-b px-4 py-2">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <span className="text-xs text-slate-500">{unreadCount} unread</span>
              </div>

              <ul role="list" className="max-h-64 overflow-auto divide-y">
                {items.length === 0 ? (
                  <li className="px-4 py-6 text-sm text-slate-500">You’re all caught up. 🎉</li>
                ) : (
                  items.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <button
                        onClick={() => markOneAsRead(n.id)}
                        className="w-full text-left"
                        aria-label={`Open notification: ${n.title}`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 inline-block h-2 w-2 rounded-full ${
                              n.unread ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">{n.title}</p>
                            {n.description ? (
                              <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                                {n.description}
                              </p>
                            ) : null}
                            <p className="mt-1 text-[11px] text-slate-500">
                              {new Date(n.timestamp).toLocaleString()}
                            </p>
                            {n.href ? (
                              <Link
                                href={n.href}
                                className="mt-1 inline-block text-[11px] text-slate-600 underline"
                                onClick={() => markOneAsRead(n.id)}
                              >
                                View details
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <div className="flex items-center justify-between border-t px-4 py-2">
                <button className="text-xs text-slate-600 hover:underline" onClick={markAllAsRead}>
                  Mark all as read
                </button>
                <Link
                  href="/notifications"
                  className="text-xs text-slate-600 hover:underline"
                  onClick={() => setOpen(false)}
                >
                  View all
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          <AnimatePresence initial={false}>
            {activeToast && (
              <motion.div
                key={activeToast.id}
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: STRIPE_WIDTH,
                  opacity: 1,
                  transition: { duration: ENTER_MS / 1000, ease: 'easeOut' },
                }}
                exit={{
                  width: 0,
                  opacity: 0,
                  transition: { duration: EXIT_MS / 1000, ease: 'easeIn' },
                }}
                style={{ transformOrigin: 'right center' }}
                className="pointer-events-none absolute top-1/2 right-14 z-50 -translate-y-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <div className="flex items-stretch">
                  <div
                    className={`w-1.5 ${levelStripe[activeToast.level ?? 'success']}`}
                  />
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{activeToast.title}</p>
                    {activeToast.description && (
                      <p className="text-xs text-slate-600">{activeToast.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div aria-live="polite" className="sr-only" role="status">
            {activeToast ? `${activeToast.title}. ${activeToast.description ?? ''}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
