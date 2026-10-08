import React, { useState } from 'react';
import {
  List,
  Kanban,
  Clock,
  Plus,
  Sparkles,
  Share2,
  Zap,
  Search,
  ChevronDown,
  ChevronRight,
  BarChart2,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { StatusIndicator, PriorityIndicator } from '../ui/Badge';
import { TaskStatus } from '../../types';

interface ProjectsViewProps {
  projectIdParam?: string;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projectIdParam }) => {
  const {
    projects,
    currentProjectId,
    tasks,
    openAiAssistant,
    setIsNewTaskModalOpen,
    setSelectedTaskDetail,
    showToast,
  } = useWorkspace();

  const [activeView, setActiveView] = useState<'list' | 'board' | 'timeline' | 'analytics'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [collapsedSprints, setCollapsedSprints] = useState<Record<string, boolean>>({});

  const activeProject = projects.find((p) => p.id === (projectIdParam || currentProjectId)) || projects[0];

  const projectTasks = tasks.filter((t) => t.projectId === activeProject.id);

  const filteredTasks = projectTasks.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesQuery = !filterQuery || t.title.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const toggleSprint = (sprintId: string) => {
    setCollapsedSprints((prev) => ({ ...prev, [sprintId]: !prev[sprintId] }));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Project link copied');
  };

  const handleAutomate = () => {
    showToast('Automation: Auto-assign lead when moved to Review');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* PROJECT HEADER */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#57534E]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeProject.color }} />
              <span className="font-semibold text-[#18181B]">{activeProject.name}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{activeProject.startDate} – {activeProject.endDate}</span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold font-mono tabular-nums">{activeProject.progress}% complete</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">
              {activeProject.name}
            </h1>
            <p className="text-xs text-[#57534E] max-w-2xl leading-relaxed">
              {activeProject.description}
            </p>
          </div>

          {/* Action strip: Automate, Ask AI, Share, + Task */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <div className="flex -space-x-1.5 mr-2">
              {activeProject.members.map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                />
              ))}
            </div>

            <Button
              variant="secondary"
              size="xs"
              icon={<Zap size={12} className="text-stone-600" />}
              onClick={handleAutomate}
            >
              Automate
            </Button>

            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() =>
                openAiAssistant({
                  title: `${activeProject.name} AI`,
                  prompt: `Analyze sprint roadmap and task breakdown for ${activeProject.name}.`,
                })
              }
            >
              Ask AI
            </Button>

            <Button
              variant="secondary"
              size="xs"
              icon={<Share2 size={12} className="text-stone-600" />}
              onClick={handleShare}
            >
              Share
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

        {/* View Switcher Tabs (List, Board, Timeline, Analytics) */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-[#F6F5F2] p-0.5 rounded border border-[#E2DFD7] text-xs">
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'list'
                  ? 'bg-white text-[#18181B] font-bold shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              <List size={13} />
              <span>List</span>
            </button>
            <button
              onClick={() => setActiveView('board')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'board'
                  ? 'bg-white text-[#18181B] font-bold shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              <Kanban size={13} />
              <span>Board</span>
            </button>
            <button
              onClick={() => setActiveView('timeline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'timeline'
                  ? 'bg-white text-[#18181B] font-bold shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              <Clock size={13} />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-white text-[#18181B] font-bold shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              <BarChart2 size={13} />
              <span>Analytics</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-2 text-[#8A857D]" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter tasks..."
                className="pl-7 pr-2.5 py-1 bg-[#F6F5F2] border border-[#E2DFD7] rounded text-xs text-[#18181B] placeholder:text-[#8A857D] focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1 bg-white border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: High-Density Table List View */}
      {activeView === 'list' && (
        <div className="space-y-3">
          {/* Main Sprint Section */}
          <div className="bg-white border border-[#E2DFD7] rounded-lg overflow-hidden shadow-2xs">
            <div
              onClick={() => toggleSprint('sp_1')}
              className="px-4 py-2.5 bg-[#F6F5F2] border-b border-[#E2DFD7] flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
                {collapsedSprints['sp_1'] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                <span>Active Sprint Execution</span>
                <span className="text-[#8A857D] font-mono font-normal">({filteredTasks.length} tasks)</span>
              </div>
              <div className="text-[11px] text-[#57534E] font-mono tabular-nums">
                Sprint 15 · Oct 5, 2026 – Oct 18, 2026
              </div>
            </div>

            {!collapsedSprints['sp_1'] && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2DFD7] bg-[#FAF9F7] text-[#57534E] font-semibold text-[11px]">
                      <th className="py-2.5 px-4 font-medium">Task Name</th>
                      <th className="py-2.5 px-4 font-medium">Status</th>
                      <th className="py-2.5 px-4 font-medium">Assignee</th>
                      <th className="py-2.5 px-4 font-medium">Due Date</th>
                      <th className="py-2.5 px-4 font-medium">Subtasks</th>
                      <th className="py-2.5 px-4 font-medium">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DFD7]">
                    {filteredTasks.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTaskDetail(t)}
                        className="hover:bg-[#F6F5F2] cursor-pointer transition-colors group h-10"
                      >
                        <td className="py-2 px-4 font-medium text-[#18181B] group-hover:text-stone-700">
                          {t.title}
                        </td>
                        <td className="py-2 px-4">
                          <StatusIndicator status={t.status} />
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={t.assignee.avatar}
                              alt={t.assignee.name}
                              referrerPolicy="no-referrer"
                              className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                            />
                            <span className="text-[#18181B]">{t.assignee.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 font-mono tabular-nums text-[#57534E]">
                          {t.dueDate}
                        </td>
                        <td className="py-2 px-4 font-mono tabular-nums text-[#57534E]">
                          ☰ 0{t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}
                        </td>
                        <td className="py-2 px-4">
                          <PriorityIndicator priority={t.priority} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Secondary Collapsible Sprint Sections */}
          {[
            { id: 'sp_2', name: 'Milestone 2: Infrastructure & APIs', start: 'Oct 19, 2026', end: 'Nov 02, 2026', count: 8 },
            { id: 'sp_3', name: 'Milestone 3: Security & Performance', start: 'Nov 03, 2026', end: 'Nov 12, 2026', count: 5 },
            { id: 'sp_4', name: 'Milestone 4: Commercial Release', start: 'Nov 13, 2026', end: 'Nov 18, 2026', count: 4 },
          ].map((sp) => (
            <div
              key={sp.id}
              className="bg-white border border-[#E2DFD7] rounded-lg px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-[#F6F5F2] transition-colors shadow-2xs"
              onClick={() => showToast(`Expanded ${sp.name}`)}
            >
              <div className="flex items-center gap-2 font-semibold text-[#18181B]">
                <ChevronRight size={14} className="text-[#8A857D]" />
                <span>{sp.name}</span>
                <span className="text-[10px] text-[#8A857D] font-normal font-mono">({sp.count} tasks)</span>
              </div>
              <div className="text-[11px] text-[#57534E] font-mono tabular-nums">
                {sp.start} – {sp.end}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Kanban Board View */}
      {activeView === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 overflow-x-auto pb-4">
          {(['todo', 'in_progress', 'in_review', 'done'] as TaskStatus[]).map((statusCol) => {
            const colTasks = projectTasks.filter((t) => t.status === statusCol);
            const colTitles: Record<TaskStatus, string> = {
              todo: 'TO DO',
              in_progress: 'IN PROGRESS',
              in_review: 'IN REVIEW',
              done: 'DONE',
            };

            return (
              <div
                key={statusCol}
                className="bg-[#F2EFE9]/60 p-3 rounded-lg border border-[#E2DFD7] flex flex-col min-w-[260px]"
              >
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#18181B]">
                  <span>{colTitles[statusCol]}</span>
                  <span className="font-mono tabular-nums text-[#57534E] bg-white px-1.5 py-0.2 rounded border border-[#E2DFD7] text-[10px]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTaskDetail(t)}
                      className="p-3 bg-white rounded-md border border-[#E2DFD7] hover:border-[#18181B] transition-colors cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <PriorityIndicator priority={t.priority} />
                        <span className="text-[10px] text-[#8A857D] font-mono tabular-nums">
                          {t.dueDate}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-[#18181B] group-hover:text-stone-700 transition-colors leading-snug">
                        {t.title}
                      </h4>

                      <div className="mt-2.5 pt-2 border-t border-[#E2DFD7]/80 flex items-center justify-between text-[11px] text-[#57534E]">
                        <span className="font-mono tabular-nums text-[10px]">
                          ☰ {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}
                        </span>
                        <img
                          src={t.assignee.avatar}
                          alt={t.assignee.name}
                          referrerPolicy="no-referrer"
                          className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="w-full py-1.5 border border-dashed border-[#E2DFD7] hover:border-[#18181B] rounded text-[11px] text-[#57534E] hover:text-[#18181B] transition-colors flex items-center justify-center gap-1 cursor-pointer bg-white/50"
                  >
                    <Plus size={12} />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: Timeline View */}
      {activeView === 'timeline' && (
        <div className="bg-white border border-[#E2DFD7] rounded-lg p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-3 text-xs">
            <h3 className="font-bold text-[#18181B]">Sprint Timeline Execution</h3>
            <span className="text-[#8A857D] font-mono">Q4 2026 Milestone</span>
          </div>

          <div className="space-y-3 text-xs">
            {activeProject.sprints?.map((sp, idx) => (
              <div key={sp.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#18181B]">
                  <span>{sp.name}</span>
                  <span className="text-[#57534E] font-mono tabular-nums">
                    {sp.startDate} – {sp.endDate}
                  </span>
                </div>
                <div className="w-full bg-[#F6F5F2] border border-[#E2DFD7] h-5 rounded relative overflow-hidden flex items-center px-2.5">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-stone-300 border-r-2 border-[#18181B]"
                    style={{ width: `${(idx + 1) * 32}%` }}
                  />
                  <span className="relative z-10 text-[10px] font-semibold text-[#18181B]">
                    {sp.taskCount} tasks assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: Analytics View */}
      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-lg border border-[#E2DFD7] space-y-1 shadow-2xs">
            <span className="text-[#8A857D] font-medium uppercase tracking-wider text-[10px]">Velocity</span>
            <div className="text-xl font-bold font-mono text-[#18181B]">5.2 pts/day</div>
            <p className="text-[11px] text-[#57534E]">On track for scheduled release freeze.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E2DFD7] space-y-1 shadow-2xs">
            <span className="text-[#8A857D] font-medium uppercase tracking-wider text-[10px]">Lead Time</span>
            <div className="text-xl font-bold font-mono text-[#18181B]">2.1 days</div>
            <p className="text-[11px] text-[#57534E]">Median deliverable turnaround.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E2DFD7] space-y-1 shadow-2xs">
            <span className="text-[#8A857D] font-medium uppercase tracking-wider text-[10px]">Quality</span>
            <div className="text-xl font-bold font-mono text-[#18181B]">99.1%</div>
            <p className="text-[11px] text-[#57534E]">Zero open high-severity issues.</p>
          </div>
        </div>
      )}
    </div>
  );
};
