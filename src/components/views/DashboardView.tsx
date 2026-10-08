import React from 'react';
import {
  FolderKanban,
  Clock,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowRight,
  FileText,
  MessageSquare,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Layers,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { StatusIndicator, PriorityIndicator } from '../ui/Badge';

export const DashboardView: React.FC = () => {
  const {
    currentWorkspace,
    projects,
    tasks,
    documents,
    members,
    navigate,
    openAiAssistant,
    setIsNewTaskModalOpen,
    setIsNewProjectModalOpen,
    setIsNewDocModalOpen,
    setSelectedTaskDetail,
    setActiveDocument,
    updateTaskStatus,
  } = useWorkspace();

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inReviewTasks = tasks.filter((t) => t.status === 'in_review').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const upcomingDeadlines = tasks.filter((t) => t.status !== 'done').slice(0, 5);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* 1. SOPHISTICATED EXECUTIVE WORKSPACE HERO & ACTION STRIP */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-stone-100 border border-stone-200 text-[#18181B] flex items-center justify-center text-xs font-bold shrink-0">
                {currentWorkspace.icon}
              </span>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">
                {currentWorkspace.name}
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                {currentWorkspace.plan}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Active Sprint
              </span>
            </div>
            <p className="text-xs text-[#57534E] max-w-3xl leading-relaxed">
              {currentWorkspace.description}
            </p>
          </div>

          {/* Members preview + Quick Action button strip */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div
              onClick={() => navigate(`/workspaces/${currentWorkspace.id}/members`)}
              className="flex items-center gap-2 pr-3 border-r border-[#E2DFD7] cursor-pointer group"
            >
              <div className="flex -space-x-1.5">
                {members.slice(0, 4).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                  />
                ))}
              </div>
              <span className="text-xs font-mono tabular-nums text-[#57534E] group-hover:text-[#18181B] transition-colors">
                {members.length} members
              </span>
            </div>

            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() => openAiAssistant({ title: 'Workspace Briefing', prompt: 'Provide a structured summary of critical deliverables due this week.' })}
            >
              Workspace Brief
            </Button>

            <Button
              variant="secondary"
              size="xs"
              icon={<Plus size={12} />}
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              New Project
            </Button>

            <Button
              variant="primary"
              size="xs"
              icon={<Plus size={12} />}
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              New Task
            </Button>
          </div>
        </div>

        {/* 2. HIGH-DENSITY METRICS ROW */}
        <div className="mt-4 pt-4 border-t border-[#E2DFD7] grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-xs">
          <div className="flex items-center gap-3 p-2 rounded bg-[#F6F5F2] border border-[#E2DFD7]/70">
            <div className="w-7 h-7 rounded bg-white border border-[#E2DFD7] flex items-center justify-center text-[#18181B] shrink-0">
              <FolderKanban size={14} />
            </div>
            <div>
              <div className="text-[11px] text-[#8A857D] font-medium">Active Initiatives</div>
              <div className="text-xs font-bold font-mono tabular-nums text-[#18181B]">{projects.length} streams</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded bg-[#F6F5F2] border border-[#E2DFD7]/70">
            <div className="w-7 h-7 rounded bg-white border border-[#E2DFD7] flex items-center justify-center text-blue-700 shrink-0">
              <Clock size={14} />
            </div>
            <div>
              <div className="text-[11px] text-[#8A857D] font-medium">In Flight Tasks</div>
              <div className="text-xs font-bold font-mono tabular-nums text-blue-800">{inProgressTasks} active</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded bg-[#F6F5F2] border border-[#E2DFD7]/70">
            <div className="w-7 h-7 rounded bg-white border border-[#E2DFD7] flex items-center justify-center text-amber-700 shrink-0">
              <Activity size={14} />
            </div>
            <div>
              <div className="text-[11px] text-[#8A857D] font-medium">Under Review</div>
              <div className="text-xs font-bold font-mono tabular-nums text-amber-800">{inReviewTasks} pending</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded bg-[#F6F5F2] border border-[#E2DFD7]/70">
            <div className="w-7 h-7 rounded bg-white border border-[#E2DFD7] flex items-center justify-center text-emerald-700 shrink-0">
              <TrendingUp size={14} />
            </div>
            <div>
              <div className="text-[11px] text-[#8A857D] font-medium">Sprint Completion</div>
              <div className="text-xs font-bold font-mono tabular-nums text-emerald-800">{completionRate}% ({completedTasks}/{totalTasks})</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE SPLIT (Left: Large Projects & Backlog | Right: Contextual Deadlines & Live Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT / LARGE (2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Projects Table Section */}
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD7]">
              <div>
                <h2 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">
                  Active Projects & Roadmap
                </h2>
                <p className="text-[11px] text-[#57534E] mt-0.5">
                  Core initiatives with milestone velocity and team leads
                </p>
              </div>
              <button
                onClick={() => navigate(`/workspaces/${currentWorkspace.id}/projects`)}
                className="text-xs text-[#18181B] hover:text-stone-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-[#E2DFD7]/80 mt-1">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/workspaces/${currentWorkspace.id}/projects/${proj.id}`)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-[#F6F5F2] -mx-2 px-2 rounded cursor-pointer transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                      <h3 className="text-xs font-bold text-[#18181B] group-hover:text-stone-700 transition-colors truncate">
                        {proj.name}
                      </h3>
                      <span className="text-[10px] text-[#8A857D] font-mono tabular-nums">
                        · {proj.startDate} – {proj.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E] truncate mt-1">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-24 text-right">
                      <div className="text-[11px] font-bold font-mono tabular-nums text-[#18181B]">
                        {proj.progress}%
                      </div>
                      <div className="w-full bg-[#E2DFD7] h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#18181B] h-full rounded-full"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex -space-x-1">
                      {proj.members.slice(0, 3).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                        />
                      ))}
                    </div>

                    <ArrowRight size={13} className="text-[#8A857D] group-hover:text-[#18181B] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Density Task Rows */}
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD7]">
              <div>
                <h2 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">
                  Sprint Execution Queue
                </h2>
                <p className="text-[11px] text-[#57534E] mt-0.5">
                  High-priority items across active sprints
                </p>
              </div>
              <button
                onClick={() => navigate(`/workspaces/${currentWorkspace.id}/tasks`)}
                className="text-xs text-[#18181B] hover:text-stone-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Kanban Board</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-[#E2DFD7]/80 mt-1">
              {tasks.slice(0, 6).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskDetail(task)}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#F6F5F2] -mx-2 px-2 rounded cursor-pointer transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <StatusIndicator status={task.status} />
                    <span className="font-medium text-[#18181B] group-hover:text-stone-700 truncate">
                      {task.title}
                    </span>
                    <span className="text-[10px] text-[#8A857D] truncate hidden sm:inline">
                      · {task.projectName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-[#57534E]">
                    <PriorityIndicator priority={task.priority} />
                    <span className="text-[11px] font-mono tabular-nums text-stone-600">
                      {task.dueDate}
                    </span>
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT / SMALL (Upcoming Deadlines, Connected Specs, Live Chat) */}
        <div className="space-y-4">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2DFD7] mb-3">
              <h3 className="text-xs font-bold text-[#18181B] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={13} className="text-stone-600" />
                <span>Upcoming Deadlines</span>
              </h3>
              <span className="text-[10px] font-mono text-[#8A857D]">This Week</span>
            </div>

            <div className="space-y-2">
              {upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskDetail(t)}
                  className="p-2.5 rounded bg-[#F6F5F2] hover:bg-[#F2EFE9] border border-[#E2DFD7]/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#18181B] truncate mr-2">{t.title}</span>
                    <PriorityIndicator priority={t.priority} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#57534E] font-mono tabular-nums">
                    <span className="truncate">{t.projectName}</span>
                    <span className="text-amber-800 font-semibold">{t.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Documents Widget */}
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2DFD7] mb-3">
              <h3 className="text-xs font-bold text-[#18181B] uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={13} className="text-stone-600" />
                <span>Recent Specifications</span>
              </h3>
              <button
                onClick={() => setIsNewDocModalOpen(true)}
                className="text-[11px] text-[#18181B] font-semibold hover:underline cursor-pointer"
              >
                + New Doc
              </button>
            </div>

            <div className="space-y-1.5">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDocument(doc);
                    navigate(`/workspaces/${currentWorkspace.id}/documents`);
                  }}
                  className="p-2 rounded hover:bg-[#F6F5F2] border border-transparent hover:border-[#E2DFD7] flex items-start gap-2.5 cursor-pointer transition-colors"
                >
                  <FileText size={14} className="text-stone-700 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 text-xs">
                    <h4 className="font-semibold text-[#18181B] truncate">
                      {doc.title}
                    </h4>
                    <p className="text-[10px] text-[#8A857D]">
                      {doc.category} · {doc.updatedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Team Activity Snippet */}
          <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2DFD7] mb-3">
              <h3 className="text-xs font-bold text-[#18181B] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={13} className="text-stone-600" />
                <span>#product-dev Stream</span>
              </h3>
              <button
                onClick={() => navigate(`/workspaces/${currentWorkspace.id}/chat`)}
                className="text-[11px] text-[#18181B] font-semibold hover:underline cursor-pointer"
              >
                Open Chat
              </button>
            </div>

            <div className="p-2.5 rounded bg-[#F6F5F2] border border-[#E2DFD7]/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#18181B]">Arjun Mehta</span>
                <span className="text-[10px] font-mono text-[#8A857D]">10:14 AM</span>
              </div>
              <p className="text-[11px] text-[#57534E] leading-relaxed">
                "Pushed the final architectural tokens and updated the sprint backlog."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
