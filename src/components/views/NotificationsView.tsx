import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckSquare,
  MessageSquare,
  FileText,
  UserPlus,
  FolderKanban,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    navigate,
    openAiAssistant,
  } = useWorkspace();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'tasks') return n.type.includes('task');
    if (filterType === 'messages') return n.type === 'message';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
      case 'task_completed':
        return <CheckSquare size={14} className="text-[#18181B]" />;
      case 'message':
        return <MessageSquare size={14} className="text-stone-700" />;
      case 'document_shared':
        return <FileText size={14} className="text-[#18181B]" />;
      case 'member_joined':
        return <UserPlus size={14} className="text-emerald-700" />;
      case 'project_update':
        return <FolderKanban size={14} className="text-[#18181B]" />;
      default:
        return <Bell size={14} className="text-[#8A857D]" />;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">Notification Center</h1>
            <p className="text-xs text-[#57534E] mt-0.5">
              Live updates on mentions, task assignments, and workspace milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={<Check size={12} />}
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() =>
                openAiAssistant({
                  title: 'Notification Digest AI',
                  prompt: 'Summarize all unread notifications and highlight items needing my action.',
                })
              }
            >
              AI Digest
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'messages', label: 'Mentions & Chat' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                filterType === f.id
                  ? 'bg-[#18181B] text-white font-bold'
                  : 'bg-[#F6F5F2] text-[#57534E] hover:text-[#18181B] border border-[#E2DFD7]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg divide-y divide-[#E2DFD7] overflow-hidden shadow-2xs">
        {filteredNotifs.length === 0 ? (
          <div className="py-14 text-center text-xs text-[#57534E]">
            No notifications in this filter view.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markAsRead(notif.id);
                if (notif.linkRoute) navigate(notif.linkRoute);
              }}
              className={`p-3.5 flex items-start gap-3 hover:bg-[#F6F5F2] transition-colors cursor-pointer ${
                !notif.read ? 'bg-[#FAF9F7]' : ''
              }`}
            >
              <div className="p-1.5 rounded bg-[#F2EFE9] shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${!notif.read ? 'text-[#18181B] font-bold' : 'text-[#57534E]'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-[#8A857D] font-mono tabular-nums">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[#57534E] mt-0.5 leading-relaxed">
                  {notif.description}
                </p>

                {notif.linkText && (
                  <div className="mt-1.5 text-[11px] text-[#18181B] font-semibold hover:underline">
                    {notif.linkText} →
                  </div>
                )}
              </div>

              {!notif.read && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
