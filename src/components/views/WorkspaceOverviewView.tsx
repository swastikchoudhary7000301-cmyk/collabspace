import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/Badge';
import { ProjectsView } from './ProjectsView';
import { TasksView } from './TasksView';
import { CalendarView } from './CalendarView';
import { DocumentsView } from './DocumentsView';
import { ChatView } from './ChatView';
import { MembersView } from './MembersView';

interface WorkspaceOverviewViewProps {
  initialSubTab?: 'overview' | 'projects' | 'tasks' | 'calendar' | 'documents' | 'chat' | 'members';
}

export const WorkspaceOverviewView: React.FC<WorkspaceOverviewViewProps> = ({ initialSubTab = 'overview' }) => {
  const {
    currentWorkspace,
    projects,
    tasks,
    documents,
    members,
    navigate,
    openAiAssistant,
    setIsNewProjectModalOpen,
    setSelectedTaskDetail,
    setActiveDocument,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'tasks' | 'calendar' | 'documents' | 'chat' | 'members'>(initialSubTab);

  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Workspace Banner */}
      <div className="bg-white border-b border-[#E2DFD7] px-4 md:px-6 pt-4 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-stone-100 text-[#18181B] flex items-center justify-center text-sm font-bold border border-stone-200 shrink-0">
              {currentWorkspace.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#18181B]">{currentWorkspace.name}</h1>
                <span className="text-[10px] font-mono uppercase bg-[#F6F5F2] text-[#57534E] px-1.5 py-0.2 rounded font-semibold border border-[#E2DFD7]">
                  {currentWorkspace.plan}
                </span>
              </div>
              <p className="text-xs text-[#57534E] mt-0.5">
                {currentWorkspace.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() =>
                openAiAssistant({
                  title: `${currentWorkspace.name} AI`,
                  prompt: `Analyze current roadmap and sprint velocity in ${currentWorkspace.name}.`,
                })
              }
            >
              Workspace AI
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<Plus size={12} />}
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-6 overflow-x-auto text-xs font-semibold no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={13} /> },
            { id: 'projects', label: 'Projects', icon: <FolderKanban size={13} />, count: projects.length },
            { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={13} />, count: tasks.length },
            { id: 'calendar', label: 'Calendar', icon: <Calendar size={13} /> },
            { id: 'documents', label: 'Documents', icon: <FileText size={13} />, count: documents.length },
            { id: 'chat', label: 'Chat', icon: <MessageSquare size={13} />, badge: 'Live' },
            { id: 'members', label: 'Members', icon: <Users size={13} />, count: members.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 pb-2.5 pt-1 border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? 'border-[#18181B] text-[#18181B] font-bold'
                    : 'border-transparent text-[#57534E] hover:text-[#18181B]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`text-[9px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-stone-200 text-[#18181B]' : 'bg-[#F2EFE9] text-[#57534E]'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab view body */}
      {activeTab === 'overview' && (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
          {/* Workspace stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-lg border border-[#E2DFD7] shadow-2xs">
              <div className="text-[11px] text-[#8A857D] font-medium">Active Projects</div>
              <div className="text-xl font-bold text-[#18181B] font-mono tabular-nums mt-0.5">
                {projects.length} streams
              </div>
              <div className="text-[10px] text-[#57534E] mt-1 font-mono">100% healthy velocity</div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#E2DFD7] shadow-2xs">
              <div className="text-[11px] text-[#8A857D] font-medium">Deliverables in Flight</div>
              <div className="text-xl font-bold text-amber-800 font-mono tabular-nums mt-0.5">
                {inProgressTasks} active
              </div>
              <div className="text-[10px] text-[#57534E] mt-1 font-mono">{tasks.length} total tasks</div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#E2DFD7] shadow-2xs">
              <div className="text-[11px] text-[#8A857D] font-medium">Workspace Velocity</div>
              <div className="text-xl font-bold text-emerald-800 font-mono tabular-nums mt-0.5">
                {progressPercent}%
              </div>
              <div className="text-[10px] text-[#57534E] mt-1 font-mono">Sprint completion rate</div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#E2DFD7] shadow-2xs">
              <div className="text-[11px] text-[#8A857D] font-medium">Team Contributors</div>
              <div className="text-xl font-bold text-[#18181B] font-mono tabular-nums mt-0.5">
                {members.length} members
              </div>
              <div className="text-[10px] text-[#57534E] mt-1 font-mono">Across 4 departments</div>
            </div>
          </div>

          {/* Active Projects Grid */}
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2DFD7]">
              <h2 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Active Workspace Projects</h2>
              <Button variant="secondary" size="xs" onClick={() => setActiveTab('projects')}>
                Manage Projects
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    navigate(`/workspaces/${currentWorkspace.id}/projects/${proj.id}`);
                  }}
                  className="p-3.5 rounded border border-[#E2DFD7] hover:border-[#18181B] transition-colors cursor-pointer group bg-[#FAF9F7]/40 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#18181B] group-hover:text-stone-700 transition-colors">
                      {proj.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#18181B]">
                      {proj.progress}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[#57534E] line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="w-full bg-[#E2DFD7] h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-[#18181B] h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deliverables & Specs Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#E2DFD7]">
                <h3 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Sprint Backlog Focus</h3>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs text-[#18181B] font-semibold hover:underline cursor-pointer"
                >
                  View Tasks →
                </button>
              </div>

              <div className="space-y-1.5">
                {tasks.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskDetail(t)}
                    className="p-2 rounded hover:bg-[#F6F5F2] flex items-center justify-between cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <StatusIndicator status={t.status} />
                      <span className="font-medium text-[#18181B] truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] text-[#8A857D] font-mono shrink-0">{t.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#E2DFD7]">
                <h3 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Specifications</h3>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="text-xs text-[#18181B] font-semibold hover:underline cursor-pointer"
                >
                  View Specs →
                </button>
              </div>

              <div className="space-y-1.5">
                {documents.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setActiveDocument(d);
                      setActiveTab('documents');
                    }}
                    className="p-2 rounded hover:bg-[#F6F5F2] flex items-center justify-between cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <FileText size={13} className="text-stone-700 shrink-0" />
                      <span className="font-semibold text-[#18181B] truncate">{d.title}</span>
                    </div>
                    <span className="text-[10px] text-[#8A857D] font-mono shrink-0">{d.updatedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Views */}
      {activeTab === 'projects' && <ProjectsView />}
      {activeTab === 'tasks' && <TasksView />}
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'documents' && <DocumentsView />}
      {activeTab === 'chat' && <ChatView />}
      {activeTab === 'members' && <MembersView />}
    </div>
  );
};
