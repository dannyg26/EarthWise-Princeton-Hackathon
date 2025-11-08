'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListTodo, MessageSquare, Settings, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/coach', label: 'Coach', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-green-600" />
          <span className="text-xl font-bold text-slate-900">EcoLife Coach</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg">
          <p className="text-xs font-medium text-slate-700 mb-1">Need guidance?</p>
          <p className="text-xs text-slate-600 mb-3">Chat with your AI coach for personalized tips.</p>
          <Link href="/coach">
            <button className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-md font-medium hover:bg-slate-50 transition-colors w-full">
              Start Chatting
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
