import React from 'react';
import {
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleTag, StatusIndicator, PriorityIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';

export const ProfileView: React.FC = () => {
  const { currentUser, tasks, setSelectedTaskDetail, openAiAssistant } = useWorkspace();

  const myTasks = tasks.filter((t) => t.assignee.id === currentUser.id);
  const completedTasks = myTasks.filter((t) => t.status === 'done');

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      {/* Profile Header */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#E2DFD7]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#18181B]">{currentUser.name}</h1>
                <RoleTag role={currentUser.role} />
              </div>
              <p className="text-xs text-[#57534E] mt-0.5">{currentUser.title} · {currentUser.department}</p>
              <div className="mt-1.5 flex items-center gap-4 text-xs text-[#57534E] font-mono tabular-nums">
                <span className="flex items-center gap-1.5">
                  <Mail size={12} className="text-[#8A857D]" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-[#8A857D]" />
                  {currentUser.timezone}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="xs"
            icon={<Sparkles size={12} className="text-stone-700" />}
            onClick={() =>
              openAiAssistant({
                title: 'Workload & Focus AI',
                prompt: 'Analyze my task completion velocity and recommend focus areas for this week.',
              })
            }
          >
            Analyze Focus
          </Button>
        </div>

        {/* Inline Metrics */}
        <div className="mt-5 pt-4 border-t border-[#E2DFD7] grid grid-cols-3 gap-3">
          <div className="p-3 bg-[#FAF9F7] rounded border border-[#E2DFD7]">
            <div className="text-[10px] text-[#8A857D] uppercase font-bold tracking-wider">Assigned Deliverables</div>
            <div className="text-xl font-bold font-mono text-[#18181B] mt-0.5">{myTasks.length}</div>
            <div className="text-[10px] text-[#57534E] mt-0.5 font-mono">3 active projects</div>
          </div>

          <div className="p-3 bg-[#FAF9F7] rounded border border-[#E2DFD7]">
            <div className="text-[10px] text-[#8A857D] uppercase font-bold tracking-wider">Completed this Sprint</div>
            <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">{completedTasks.length}</div>
            <div className="text-[10px] text-emerald-700 mt-0.5 font-mono">100% on-schedule</div>
          </div>

          <div className="p-3 bg-[#FAF9F7] rounded border border-[#E2DFD7]">
            <div className="text-[10px] text-[#8A857D] uppercase font-bold tracking-wider">Velocity Score</div>
            <div className="text-xl font-bold font-mono text-[#18181B] mt-0.5">96%</div>
            <div className="text-[10px] text-[#57534E] mt-0.5 font-mono">Zero blockers</div>
          </div>
        </div>
      </div>

      {/* Assigned Tasks List */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 space-y-3 shadow-2xs">
        <h2 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">My Assigned Deliverables</h2>
        <div className="divide-y divide-[#E2DFD7]">
          {myTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTaskDetail(t)}
              className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#F6F5F2] -mx-2 px-2 rounded cursor-pointer transition-colors text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <StatusIndicator status={t.status} />
                <span className="font-medium text-[#18181B] truncate">{t.title}</span>
                <span className="text-[10px] text-[#8A857D] hidden sm:inline truncate">· {t.projectName}</span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 text-[#57534E]">
                <PriorityIndicator priority={t.priority} />
                <span className="text-[10px] font-mono tabular-nums">{t.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
