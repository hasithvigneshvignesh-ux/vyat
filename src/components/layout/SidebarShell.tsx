'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import StudentSidebar from './StudentSidebar';

interface SidebarShellProps {
  userName: string;
  children: React.ReactNode;
}

/**
 * SidebarShell
 *
 * Owns the single `isCollapsed` state that drives:
 *  - sidebar open/closed width
 *  - the floating "reopen" chevron button
 *  - the sidebar's own internal collapse button
 *
 * This keeps the two controls perfectly in sync and avoids
 * any lifting of state into a server component.
 */
export default function SidebarShell({ userName, children }: SidebarShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar-layout${isCollapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Sidebar — receives collapse state as controlled prop */}
      <StudentSidebar
        userName={userName}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((v) => !v)}
      />

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
