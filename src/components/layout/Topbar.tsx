import React from 'react';
import {
  Search,
  Plus,
  Sparkles,
  Bell,
  Menu,
  ChevronRight,
  Command,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const Topbar: React.FC = () => {
  const {
    currentUser,
    currentRoute,
    currentWorkspace,
    projects,
    currentProjectId,
    setIsCommandPaletteOpen,
    openAiAssistant,
    unreadNotificationCount,
    navigate,
    setMobileSidebarOpen,
    setIsNewTaskModalOpen,
  } = useWorkspace();

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const getBreadcrumbs = () => {
    const parts = [{ label: currentWorkspace.name, route: `/workspaces/${currentWorkspace.id}` }];

    if (currentRoute.includes('/projects')) {
      parts.push({ label: 'Projects', route: `/workspaces/${currentWorkspace.id}/projects` });
      if (currentProject && currentRoute.includes(currentProject.id)) {
        parts.push({ label: currentProject.name, route: currentRoute });
      }
    } else if (currentRoute.includes('/tasks')) {
      parts.push({ label: 'Tasks', route: `/workspaces/${currentWorkspace.id}/tasks` });
    } else if (currentRoute.includes('/calendar')) {
      parts.push({ label: 'Calendar', route: `/workspaces/${currentWorkspace.id}/calendar` });
    } else if (currentRoute.includes('/documents')) {
      parts.push({ label: 'Documents', route: `/workspaces/${currentWorkspace.id}/documents` });
    } else if (currentRoute.includes('/chat')) {
      parts.push({ label: 'Team Chat', route: `/workspaces/${currentWorkspace.id}/chat` });
    } else if (currentRoute.includes('/members')) {
      parts.push({ label: 'Members', route: `/workspaces/${currentWorkspace.id}/members` });
    } else if (currentRoute === '/notifications') {
      parts.push({ label: 'Notifications', route: '/notifications' });
    } else if (currentRoute === '/settings') {
      parts.push({ label: 'Settings', route: '/settings' });
    } else if (currentRoute === '/profile') {
      parts.push({ label: 'User Profile', route: '/profile' });
    } else {
      parts.push({ label: 'Overview', route: `/workspaces/${currentWorkspace.id}` });
    }

    return parts;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-12 bg-white/95 backdrop-blur-xs border-b border-[#E2DFD7] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile toggle & Compact Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-1 -ml-1 text-[#57534E] hover:text-[#18181B] rounded md:hidden cursor-pointer"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#57534E] truncate font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <ChevronRight size={12} className="text-[#A8A29E] shrink-0" />}
              <button
                onClick={() => navigate(crumb.route)}
                className={`truncate hover:text-[#18181B] transition-colors cursor-pointer ${
                  idx === breadcrumbs.length - 1 ? 'text-[#18181B] font-semibold' : ''
                }`}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Zone 2: Compact Search Input (⌘K) */}
      <div className="hidden sm:flex items-center flex-1 max-w-xs mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-2.5 py-1 text-xs text-[#57534E] bg-[#F6F5F2] hover:bg-[#F2EFE9] border border-[#E2DFD7] rounded-md transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search size={13} className="text-[#8A857D]" />
            <span className="text-[11px] font-normal">Search workspace...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 text-[9px] font-mono text-[#57534E] bg-white border border-[#E2DFD7] px-1.5 py-0.2 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-1.5 text-[#57534E] hover:text-[#18181B] rounded sm:hidden cursor-pointer"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        <button
          onClick={() => openAiAssistant({ title: 'Workspace AI', prompt: 'Summarize recent roadmap updates' })}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#18181B] bg-white hover:bg-[#F6F5F2] border border-[#E2DFD7] rounded-md transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles size={13} className="text-stone-700" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-[#18181B] hover:bg-[#27272A] border border-[#18181B] rounded-md transition-colors cursor-pointer shadow-2xs"
        >
          <Plus size={13} />
          <span>New Task</span>
        </button>

        <button
          onClick={() => navigate('/notifications')}
          className="relative p-1.5 text-[#57534E] hover:text-[#18181B] rounded hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#18181B]" />
          )}
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="ml-1 cursor-pointer"
          aria-label="User profile"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E2DFD7]"
          />
        </button>
      </div>
    </header>
  );
};
