import React, { useState } from 'react';
import {
  Kanban,
  List,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { StatusIndicator, PriorityIndicator } from '../ui/Badge';
import { TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    projects,
    updateTaskStatus,
    setIsNewTaskModalOpen,
    setSelectedTaskDetail,
    openAiAssistant,
  } = useWorkspace();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = selectedProjectFilter === 'all' || t.projectId === selectedProjectFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || t.priority === selectedPriorityFilter;
    const matchesSearch = !searchFilter || t.title.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesProject && matchesPriority && matchesSearch;
  });

  const columns: { id: TaskStatus; label: string; countBadge: string }[] = [
    { id: 'todo', label: 'TO DO', countBadge: 'bg-stone-200 text-stone-700' },
    { id: 'in_progress', label: 'IN PROGRESS', countBadge: 'bg-blue-100 text-blue-800' },
    { id: 'in_review', label: 'IN REVIEW', countBadge: 'bg-amber-100 text-amber-800' },
    { id: 'done', label: 'DONE', countBadge: 'bg-emerald-100 text-emerald-800' },
  ];

  const nextStatusMap: Record<TaskStatus, TaskStatus | null> = {
    todo: 'in_progress',
    in_progress: 'in_review',
    in_review: 'done',
    done: null,
  };

  const prevStatusMap: Record<TaskStatus, TaskStatus | null> = {
    todo: null,
    in_progress: 'todo',
    in_review: 'in_progress',
    done: 'in_review',
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* HEADER & FILTER BAR */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">
              Workspace Tasks & Execution
            </h1>
            <p className="text-xs text-[#57534E] mt-0.5">
              High-density task pipeline across engineering, design, and growth roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() =>
                openAiAssistant({
                  title: 'Task Generation AI',
                  prompt: 'Generate next actionable subtasks for in-progress deliverables.',
                })
              }
            >
              Suggest Subtasks
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<Plus size={12} />}
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center flex-wrap gap-2.5">
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="px-2.5 py-1 bg-[#F6F5F2] border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="px-2.5 py-1 bg-[#F6F5F2] border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] capitalize"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-2 text-[#8A857D]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search tasks..."
                className="pl-7 pr-2.5 py-1 bg-[#F6F5F2] border border-[#E2DFD7] rounded text-xs text-[#18181B] placeholder:text-[#8A857D] focus:outline-none focus:border-[#18181B]"
              />
            </div>
          </div>

          {/* Board / List switch */}
          <div className="flex items-center gap-1 bg-[#F6F5F2] border border-[#E2DFD7] p-0.5 rounded text-xs">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-[#18181B] font-bold shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              <Kanban size={13} />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#18181B] font-bold shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              <List size={13} />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEWPORT BODY */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#F2EFE9]/60 p-3 rounded-lg border border-[#E2DFD7] flex flex-col min-w-[260px]"
              >
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#18181B]">
                  <span>{col.label}</span>
                  <span className={`font-mono tabular-nums px-1.5 py-0.2 rounded text-[10px] font-bold ${col.countBadge}`}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto min-h-[380px]">
                  {colTasks.map((t) => {
                    const prevStatus = prevStatusMap[t.status];
                    const nextStatus = nextStatusMap[t.status];

                    return (
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

                        <div className="text-[10px] text-[#57534E] mt-1 truncate">
                          {t.projectName}
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#E2DFD7]/80 flex items-center justify-between text-[11px] text-[#57534E]">
                          <span className="font-mono tabular-nums text-[10px] text-stone-600">
                            ☰ {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}
                          </span>
                          <img
                            src={t.assignee.avatar}
                            alt={t.assignee.name}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                          />
                        </div>

                        {/* Quick Status Shift */}
                        <div
                          className="mt-2 pt-1.5 border-t border-[#F6F5F2] flex items-center justify-between text-[10px] text-[#57534E]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prevStatus ? (
                            <button
                              onClick={() => updateTaskStatus(t.id, prevStatus)}
                              className="hover:text-[#18181B] cursor-pointer flex items-center gap-0.5"
                            >
                              <ArrowLeft size={10} /> Back
                            </button>
                          ) : <span />}

                          {nextStatus ? (
                            <button
                              onClick={() => updateTaskStatus(t.id, nextStatus)}
                              className="hover:text-[#18181B] font-semibold cursor-pointer ml-auto flex items-center gap-0.5"
                            >
                              Advance <ArrowRight size={10} />
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-semibold ml-auto">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="w-full py-1.5 border border-dashed border-[#E2DFD7] hover:border-[#18181B] rounded text-[11px] text-[#57534E] hover:text-[#18181B] transition-colors flex items-center justify-center gap-1 cursor-pointer bg-white/50"
                  >
                    <Plus size={12} />
                    <span>New Task</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DENSE TABLE LIST VIEW */
        <div className="bg-white border border-[#E2DFD7] rounded-lg overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2DFD7] bg-[#F6F5F2] text-[#57534E] font-semibold text-[11px]">
                <th className="py-2.5 px-4 font-medium">Deliverable Title</th>
                <th className="py-2.5 px-4 font-medium">Project</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium">Priority</th>
                <th className="py-2.5 px-4 font-medium">Assignee</th>
                <th className="py-2.5 px-4 font-medium">Due Date</th>
                <th className="py-2.5 px-4 font-medium">Subtasks</th>
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
                  <td className="py-2 px-4 text-[#57534E]">{t.projectName}</td>
                  <td className="py-2 px-4">
                    <StatusIndicator status={t.status} />
                  </td>
                  <td className="py-2 px-4">
                    <PriorityIndicator priority={t.priority} />
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
                  <td className="py-2 px-4 font-mono tabular-nums text-[#57534E]">{t.dueDate}</td>
                  <td className="py-2 px-4 font-mono tabular-nums text-[#57534E]">
                    ☰ {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
