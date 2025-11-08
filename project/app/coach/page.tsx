'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ChatWindow from '@/components/ChatWindow';

export default function CoachPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar
          title="AI Coach"
          subtitle="Get personalized guidance for your wellness journey"
        />

        <main className="flex-1 p-8">
          <div className="h-[calc(100vh-180px)]">
            <ChatWindow />
          </div>
        </main>
      </div>
    </div>
  );
}
