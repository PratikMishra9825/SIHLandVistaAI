import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { ChatAssistant } from './ChatAssistant';
import { SIHDemoModal } from './SIHDemoModal';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#17211B] flex flex-col font-sans selection:bg-[#EAF7EF] selection:text-[#166534]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#17211B] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#EAF7EF] selection:text-[#166534]">
      {/* Fixed Topbar */}
      <Topbar />

      {/* Main App Body with Sidebar & Content */}
      <div className="flex-1 flex relative z-10">
        {/* Left Collapsible Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Main Workspace Container */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 max-w-[1600px] mx-auto w-full ${
            isSidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Drawer */}
      <ChatAssistant />

      {/* Cinematic 9-Scene SIH Demo Mode Modal */}
      <SIHDemoModal />
    </div>
  );
};
