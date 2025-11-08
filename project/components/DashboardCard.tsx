'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  children?: React.ReactNode;
}

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  iconColor = 'text-green-600',
  iconBgColor = 'bg-green-100',
  children,
}: DashboardCardProps) {
  return (
    <div className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-6">
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
