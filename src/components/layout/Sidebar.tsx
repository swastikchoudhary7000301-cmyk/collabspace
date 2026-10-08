import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Bell,
  Settings,
  ChevronDown,
  Plus,
  Sparkles,
  LogOut,
  X,
  Code2,
  Megaphone,
  Palette,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { BrandLogo } from '../ui/BrandLogo';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    logout,
    currentRoute,
    navigate,
    workspaces,
    currentWorkspace,
    switchWorkspace,
    unreadNotificationCount,
    openAiAssistant,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    setIsNewProjectModalOpen,
  } = useWorkspace();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const mainNavItems = [
    {
      label: 'Overview',
      icon: <LayoutDashboard size={15} />,
      route: `/workspaces/${currentWorkspace.id}`,
      activeMatch: [`/workspaces/${currentWorkspace.id}`, '/dashboard'],
    },
    {
      label: 'Projects',
      icon: <FolderKanban size={15} />,
      route: `/workspaces/${currentWorkspace.id}/projects`,
      activeMatch: [`/workspaces/${currentWorkspace.id}/projects`],
    },
    {
      label: 'Tasks',
      icon: <CheckSquare size={15} />,
      route: `/workspaces/${currentWorkspace.id}/tasks`,
      activeMatch: [`/workspaces/${currentWorkspace.id}/tasks`],
    },
    {
      label: 'Calendar',
      icon: <Calendar size={15} />,
      route: `/workspaces/${currentWorkspace.id}/calendar`,
      activeMatch: [`/workspaces/${currentWorkspace.id}/calendar`],
    },
    {
      label: 'Documents',
      icon: <FileText size={15} />,
      route: `/workspaces/${currentWorkspace.id}/documents`,
      activeMatch: [`/workspaces/${currentWorkspace.id}/documents`],
    },
    {
      label: 'Chat',
      icon: <MessageSquare size={15} />,
      route: `/workspaces/${currentWorkspace.id}/chat`,
      badge: 4,
      activeMatch: [`/workspaces/${currentWorkspace.id}/chat`],
    },
    {
      label: 'Members',
      icon: <Users size={15} />,
      route: `/workspaces/${currentWorkspace.id}/members`,
      activeMatch: [`/workspaces/${currentWorkspace.id}/members`],
    },
  ];

  const teamspaces = [
    {
      id: 'design',
      title: 'Product Design',
      icon: <Palette size={13} className="text-stone-700" />,
      items: [
        { label: 'UI Projects', route: `/workspaces/${currentWorkspace.id}/projects/proj_website` },
        { label: 'Design Sprints', route: `/workspaces/${currentWorkspace.id}/projects/proj_design_system` },
        { label: 'Token Specs', route: `/workspaces/${currentWorkspace.id}/documents` },
      ],
    },
    {
      id: 'eng',
      title: 'Engineering',
      icon: <Code2 size={13} className="text-emerald-700" />,
      items: [
        { label: 'Product Roadmap', route: `/workspaces/${currentWorkspace.id}/projects/proj_mobile` },
        { label: 'AI Workspace', route: `/workspaces/${currentWorkspace.id}/projects/proj_ai` },
        { label: 'Sprint Backlog', route: `/workspaces/${currentWorkspace.id}/tasks` },
      ],
    },
    {
      id: 'growth',
      title: 'Marketing & Ops',
      icon: <Megaphone size={13} className="text-amber-700" />,
      items: [
        { label: 'Campaign Planner', route: `/workspaces/${currentWorkspace.id}/projects/proj_marketing` },
        { label: 'Keynote Assets', route: `/workspaces/${currentWorkspace.id}/documents` },
      ],
    },
  ];

  const isItemActive = (matches?: string[], directRoute?: string) => {
    if (matches) {
      return matches.some((m) => currentRoute === m || (m !== `/workspaces/${currentWorkspace.id}` && currentRoute.startsWith(m)));
    }
    return directRoute ? currentRoute.startsWith(directRoute) : false;
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-2xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Redesigned Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#F6F5F2] border-r border-[#E2DFD7] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand & Workspace Switcher Header */}
          <div className="p-3 border-b border-[#E2DFD7]">
            <div className="flex items-center justify-between mb-2.5">
              <BrandLogo size="md" onClick={() => navigate('/')} />

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-[#57534E] hover:text-[#18181B] md:hidden cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Workspace Selector */}
            <div className="relative">
              <button
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white hover:bg-[#F2EFE9] border border-[#E2DFD7] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-4.5 h-4.5 rounded bg-stone-100 text-[#18181B] border border-stone-200 flex items-center justify-center text-[11px] font-bold shrink-0">
                    {currentWorkspace.icon}
                  </span>
                  <span className="text-xs font-semibold text-[#18181B] truncate">
                    {currentWorkspace.name}
                  </span>
                </div>
                <ChevronDown
                  size={12}
                  className={`text-[#8A857D] transition-transform shrink-0 ${
                    workspaceMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Workspace Dropdown */}
              {workspaceMenuOpen && (
                <div className="absolute left-0 right-0 top-9 z-50 bg-white rounded-md border border-[#E2DFD7] shadow-md p-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[9px] font-bold tracking-wider text-[#8A857D] uppercase">
                    Workspaces
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        switchWorkspace(ws.id);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs text-left cursor-pointer transition-colors ${
                        ws.id === currentWorkspace.id
                          ? 'bg-[#F2EFE9] text-[#18181B] font-semibold'
                          : 'text-[#18181B] hover:bg-[#F6F5F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{ws.icon}</span>
                        <span>{ws.name}</span>
                      </div>
                      {ws.id === currentWorkspace.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                      )}
                    </button>
                  ))}
                  <div className="my-1 border-t border-[#E2DFD7]" />
                  <button
                    onClick={() => {
                      setWorkspaceMenuOpen(false);
                      setIsNewProjectModalOpen(true);
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-[#57534E] hover:text-[#18181B] hover:bg-[#F6F5F2] cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Create Workspace</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick AI Assistant Trigger */}
          <div className="px-3 pt-2.5 pb-1">
            <button
              onClick={() => openAiAssistant({ title: 'Workspace Assistant', prompt: 'Summarize today’s sprint priorities and blockers' })}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white hover:bg-[#F2EFE9] border border-[#E2DFD7] text-xs font-medium text-[#18181B] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-stone-700 shrink-0" />
                <span className="text-[11px] font-semibold text-[#18181B]">Workspace AI</span>
              </div>
              <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-stone-100 border border-stone-200 text-[#57534E] font-medium">
                ⌘K
              </span>
            </button>
          </div>

          {/* Main Workspace Navigation */}
          <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-4 text-xs">
            {/* Primary Navigation List */}
            <nav className="space-y-0.5">
              {mainNavItems.map((item) => {
                const active = isItemActive(item.activeMatch);
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer group ${
                      active
                        ? 'bg-white text-[#18181B] font-semibold shadow-2xs border border-[#E2DFD7]'
                        : 'text-[#57534E] hover:text-[#18181B] hover:bg-[#EFECE5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={active ? 'text-[#18181B]' : 'text-[#8A857D] group-hover:text-[#18181B]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded bg-stone-200 text-[#18181B] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Teamspaces (Inspired by Reference 1) */}
            <div className="pt-2 border-t border-[#E2DFD7]">
              <div className="flex items-center justify-between px-2 pb-1.5 text-[10px] font-bold text-[#8A857D] uppercase tracking-wider">
                <span>Teamspaces</span>
                <button
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="p-0.5 text-[#8A857D] hover:text-[#18181B] cursor-pointer"
                  title="Add project stream"
                >
                  <Plus size={12} />
                </button>
              </div>

              <div className="space-y-1 mt-0.5">
                {teamspaces.map((ts) => {
                  const isCollapsed = collapsedSections[ts.id];
                  return (
                    <div key={ts.id} className="space-y-0.5">
                      <button
                        onClick={() => toggleSection(ts.id)}
                        className="w-full flex items-center justify-between px-2 py-1 rounded text-[11px] font-semibold text-[#18181B] hover:bg-[#EFECE5] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {ts.icon}
                          <span>{ts.title}</span>
                        </div>
                        <ChevronDown
                          size={11}
                          className={`text-[#8A857D] transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                        />
                      </button>

                      {!isCollapsed && (
                        <div className="pl-4 space-y-0.5 border-l border-[#E2DFD7] ml-3.5">
                          {ts.items.map((sub) => {
                            const active = currentRoute === sub.route;
                            return (
                              <button
                                key={sub.label}
                                onClick={() => navigate(sub.route)}
                                className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors cursor-pointer flex items-center justify-between ${
                                  active
                                    ? 'text-[#18181B] font-semibold bg-white border border-[#E2DFD7]'
                                    : 'text-[#57534E] hover:text-[#18181B] hover:bg-[#EFECE5]'
                                }`}
                              >
                                <span className="truncate">{sub.label}</span>
                                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System Navigation Links */}
            <div className="pt-2 border-t border-[#E2DFD7] space-y-0.5">
              <button
                onClick={() => navigate('/notifications')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  currentRoute === '/notifications'
                    ? 'bg-white text-[#18181B] font-semibold border border-[#E2DFD7]'
                    : 'text-[#57534E] hover:text-[#18181B] hover:bg-[#EFECE5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell size={15} className={currentRoute === '/notifications' ? 'text-[#18181B]' : 'text-[#8A857D]'} />
                  <span>Notifications</span>
                </div>
                {unreadNotificationCount > 0 && (
                  <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded bg-[#18181B] text-white font-bold">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/settings')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  currentRoute === '/settings'
                    ? 'bg-white text-[#18181B] font-semibold border border-[#E2DFD7]'
                    : 'text-[#57534E] hover:text-[#18181B] hover:bg-[#EFECE5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings size={15} className={currentRoute === '/settings' ? 'text-[#18181B]' : 'text-[#8A857D]'} />
                  <span>Settings</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Compact User Profile Footer */}
        <div className="p-2.5 border-t border-[#E2DFD7] bg-[#F2EFE9]/60">
          <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-white border border-transparent hover:border-[#E2DFD7] transition-colors">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 min-w-0 text-left cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-600 ring-1 ring-white" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#18181B] group-hover:text-stone-700 transition-colors truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#8A857D] truncate font-medium">
                  {currentUser.title}
                </div>
              </div>
            </button>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1 text-[#8A857D] hover:text-[#18181B] rounded hover:bg-[#F6F5F2] cursor-pointer"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
