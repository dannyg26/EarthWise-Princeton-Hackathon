'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardCard from '@/components/DashboardCard';
import { Heart, Leaf, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const healthTasks = [
  { id: 1, title: 'Morning meditation', points: 20, completed: false },
  { id: 2, title: '8 glasses of water', points: 15, completed: true },
  { id: 3, title: '30-minute walk', points: 25, completed: false },
  { id: 4, title: 'Healthy breakfast', points: 20, completed: true },
  { id: 5, title: '10 minutes stretching', points: 15, completed: false },
];

const ecoTasks = [
  { id: 6, title: 'Use reusable bags', points: 20, completed: false },
  { id: 7, title: 'Bike instead of drive', points: 30, completed: false },
  { id: 8, title: 'Reduce water usage', points: 15, completed: true },
  { id: 9, title: 'Recycle properly', points: 20, completed: true },
  { id: 10, title: 'Plant-based meal', points: 25, completed: false },
];

export default function TasksPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <TopBar
          title="Tasks"
          subtitle="Complete tasks to earn points and build streaks"
        />

        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Health Tasks"
              description="Build healthy habits for better wellness"
              icon={Heart}
              iconColor="text-pink-600"
              iconBgColor="bg-pink-100"
            >
              <div className="space-y-2 mt-4">
                {healthTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">{task.points} points</p>
                      </div>
                    </div>
                    {!task.completed && (
                      <Button size="sm" variant="outline">
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Eco Tasks"
              description="Take action for a sustainable future"
              icon={Leaf}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            >
              <div className="space-y-2 mt-4">
                {ecoTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">{task.points} points</p>
                      </div>
                    </div>
                    {!task.completed && (
                      <Button size="sm" variant="outline">
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
}
