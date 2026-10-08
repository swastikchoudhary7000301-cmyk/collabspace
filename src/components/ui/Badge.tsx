import React from 'react';
import { Priority, TaskStatus, MemberRole } from '../../types';

interface StatusDotProps {
  status: TaskStatus;
  label?: string;
}

export const StatusIndicator: React.FC<StatusDotProps> = ({ status, label }) => {
  // Modeled after Reference 1 screenshot: subtle rounded-md tag with colored dot and matching text
  const config: Record<TaskStatus, { bg: string; dot: string; text: string; label: string }> = {
    todo: {
      bg: 'bg-stone-100/90 border border-stone-200/80',
      dot: 'bg-stone-400',
      text: 'text-stone-600',
      label: 'To Do',
    },
    in_progress: {
      bg: 'bg-blue-50/80 border border-blue-200/60',
      dot: 'bg-blue-600',
      text: 'text-blue-700',
      label: 'In Progress',
    },
    in_review: {
      bg: 'bg-amber-50/80 border border-amber-200/60',
      dot: 'bg-amber-500',
      text: 'text-amber-800',
      label: 'In Review',
    },
    done: {
      bg: 'bg-emerald-50/80 border border-emerald-200/60',
      dot: 'bg-emerald-600',
      text: 'text-emerald-700',
      label: 'Done',
    },
  };

  const item = config[status] || config.todo;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tabular-nums ${item.bg} ${item.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />
      <span>{label || item.label}</span>
    </span>
  );
};

export const PriorityIndicator: React.FC<{ priority: Priority }> = ({ priority }) => {
  const config: Record<Priority, { label: string; text: string; dot: string }> = {
    low: { label: 'Low', text: 'text-stone-500', dot: 'bg-stone-400' },
    medium: { label: 'Medium', text: 'text-stone-700 font-medium', dot: 'bg-stone-600' },
    high: { label: 'High', text: 'text-amber-700 font-medium', dot: 'bg-amber-500' },
    urgent: { label: 'Urgent', text: 'text-rose-700 font-semibold', dot: 'bg-rose-600' },
  };

  const item = config[priority] || config.medium;

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] ${item.text} tracking-tight`}>
      <span className={`w-1 h-1 rounded-full ${item.dot}`} />
      <span>{item.label}</span>
    </span>
  );
};

export const RoleTag: React.FC<{ role: MemberRole }> = ({ role }) => {
  const roleStyles: Record<MemberRole, string> = {
    OWNER: 'text-[#18181B] bg-stone-100 border border-stone-300 font-semibold',
    ADMIN: 'text-stone-800 bg-stone-100/90 border border-stone-200 font-medium',
    MEMBER: 'text-stone-600 bg-[#F6F5F2] border border-[#E2DFD7] font-medium',
    VIEWER: 'text-stone-500 bg-[#F6F5F2] border border-[#E2DFD7]',
  };

  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleStyles[role]}`}>
      {role}
    </span>
  );
};
