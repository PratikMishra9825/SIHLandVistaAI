import React, { useState, useEffect } from 'react';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  // Automatically close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#17211B] flex flex-col font-sans selection:bg-[#EAF7EF] selection:text-[#166534]">
        {children}
      </div>
    );
  }

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#17211B] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#EAF7EF] selection:text-[#166534]">
      {/* Fixed Topbar */}
      <Topbar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main App Body with Sidebar & Content */}
      <div className="flex-1 flex min-w-0 relative z-10">
        {/* Left Collapsible Sidebar - NOT rendered on Landing Page */}
        {!isLandingPage && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Dynamic Main Workspace Container with padding for fixed sidebar */}
        <div
          className={`flex-1 min-w-0 flex flex-col transition-[padding] duration-300 ${
            isLandingPage ? 'pl-0' : isSidebarCollapsed ? 'pl-0 md:pl-16' : 'pl-0 md:pl-64'
          }`}
        >
          <main className={`flex-1 min-w-0 w-full box-border ${isLandingPage ? 'p-0 max-w-none' : 'p-2.5 sm:p-5 md:p-6 max-w-[1600px] mx-auto'}`}>
            {children}
          </main>
        </div>
      </div>

      {/* Floating AI Assistant Drawer */}
      <ChatAssistant />

      {/* Cinematic 9-Scene SIH Demo Mode Modal */}
      <SIHDemoModal />
    </div>
  );
};
