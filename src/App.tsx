/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { AiAssistantModal } from './components/layout/AiAssistantModal';
import { NewTaskModal } from './components/layout/NewTaskModal';
import { NewProjectModal, NewDocModal } from './components/layout/NewProjectModal';
import { TaskDetailModal } from './components/layout/TaskDetailModal';
import { Toast } from './components/ui/Toast';

import { LandingView } from './components/views/LandingView';
import { AuthView } from './components/views/AuthView';
import { DashboardView } from './components/views/DashboardView';
import { WorkspaceOverviewView } from './components/views/WorkspaceOverviewView';
import { ProjectsView } from './components/views/ProjectsView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { DocumentsView } from './components/views/DocumentsView';
import { ChatView } from './components/views/ChatView';
import { MembersView } from './components/views/MembersView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';
import { ProfileView } from './components/views/ProfileView';

const AppContent: React.FC = () => {
  const { currentRoute, activeToast, showToast } = useWorkspace();

  // Landing page route
  if (currentRoute === '/') {
    return <LandingView />;
  }

  // Authentication routes
  if (currentRoute === '/login') {
    return <AuthView mode="login" />;
  }

  if (currentRoute === '/register') {
    return <AuthView mode="register" />;
  }

  // Route View Selection
  const renderCurrentView = () => {
    if (currentRoute === '/dashboard') {
      return <DashboardView />;
    }

    if (currentRoute.includes('/projects/')) {
      const parts = currentRoute.split('/projects/');
      const projectId = parts[1];
      return <ProjectsView projectIdParam={projectId} />;
    }

    if (currentRoute.includes('/projects')) {
      return <ProjectsView />;
    }

    if (currentRoute.includes('/tasks')) {
      return <TasksView />;
    }

    if (currentRoute.includes('/calendar')) {
      return <CalendarView />;
    }

    if (currentRoute.includes('/documents')) {
      return <DocumentsView />;
    }

    if (currentRoute.includes('/chat')) {
      return <ChatView />;
    }

    if (currentRoute.includes('/members')) {
      return <MembersView />;
    }

    if (currentRoute === '/notifications') {
      return <NotificationsView />;
    }

    if (currentRoute === '/settings') {
      return <SettingsView />;
    }

    if (currentRoute === '/profile') {
      return <ProfileView />;
    }

    // Default: Workspace Overview
    return <WorkspaceOverviewView />;
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#18181B] flex flex-col md:flex-row antialiased selection:bg-stone-200 selection:text-stone-900">
      {/* Redesigned 240px Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 md:pl-60 flex flex-col min-w-0 min-h-screen">
        {/* Compact 48px Topbar */}
        <Topbar />

        {/* View Content */}
        <main className="flex-1 min-w-0 bg-[#F6F5F2]">
          {renderCurrentView()}
        </main>
      </div>

      {/* Modals & Overlays */}
      <CommandPalette />
      <AiAssistantModal />
      <NewTaskModal />
      <NewProjectModal />
      <NewDocModal />
      <TaskDetailModal />
      <Toast message={activeToast} onDismiss={() => showToast('')} />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
