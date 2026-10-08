import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TaskStatus, Priority } from '../../types';
import {
  Calendar,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { currentUser } from '../../mock/data';

export const TaskDetailModal: React.FC = () => {
  const {
    selectedTaskDetail,
    setSelectedTaskDetail,
    updateTask,
    deleteTask,
    openAiAssistant,
  } = useWorkspace();

  const [commentText, setCommentText] = useState('');
  const [mockComments, setMockComments] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: 'c1', user: 'Rahul Sharma', text: 'Confirmed the viewport breakpoint rules with the design team.', time: 'Yesterday at 3:14 PM' },
    { id: 'c2', user: 'Priya Patel', text: 'Uploaded the responsive token matrix to the document repository.', time: 'Today at 10:02 AM' },
  ]);

  if (!selectedTaskDetail) return null;

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = selectedTaskDetail.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask(selectedTaskDetail.id, { subtasks: updatedSubtasks });
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(selectedTaskDetail.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    updateTask(selectedTaskDetail.id, { priority: newPriority });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setMockComments([
      ...mockComments,
      {
        id: `c_${Date.now()}`,
        user: currentUser.name,
        text: commentText.trim(),
        time: 'Just now',
      },
    ]);
    setCommentText('');
    updateTask(selectedTaskDetail.id, {
      commentsCount: (selectedTaskDetail.commentsCount || 0) + 1,
    });
  };

  const completedSubtasks = selectedTaskDetail.subtasks.filter((s) => s.completed).length;

  return (
    <Modal
      isOpen={!!selectedTaskDetail}
      onClose={() => setSelectedTaskDetail(null)}
      title={selectedTaskDetail.title}
      description={`Deliverable in ${selectedTaskDetail.projectName || 'Active Project'} · Created ${selectedTaskDetail.createdAt}`}
      maxWidth="xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <Button
            variant="danger"
            size="xs"
            icon={<Trash2 size={12} />}
            onClick={() => deleteTask(selectedTaskDetail.id)}
          >
            Delete
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() => {
                const title = selectedTaskDetail.title;
                setSelectedTaskDetail(null);
                openAiAssistant({
                  title: 'Task Breakdown',
                  prompt: `Analyze the task "${title}" and recommend next steps or potential blockers.`,
                });
              }}
            >
              Analyze with AI
            </Button>
            <Button variant="primary" size="xs" onClick={() => setSelectedTaskDetail(null)}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-[#18181B]">
        {/* Properties Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-[#FAF9F7] rounded border border-[#E2DFD7]">
          <div>
            <span className="text-[10px] font-bold text-[#8A857D] uppercase block mb-1">Status</span>
            <select
              value={selectedTaskDetail.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="bg-white border border-[#E2DFD7] rounded px-2 py-0.5 text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8A857D] uppercase block mb-1">Priority</span>
            <select
              value={selectedTaskDetail.priority}
              onChange={(e) => handlePriorityChange(e.target.value as Priority)}
              className="bg-white border border-[#E2DFD7] rounded px-2 py-0.5 text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] capitalize"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8A857D] uppercase block mb-1">Assignee</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <img
                src={selectedTaskDetail.assignee.avatar}
                alt={selectedTaskDetail.assignee.name}
                referrerPolicy="no-referrer"
                className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
              />
              <span className="font-medium text-[#18181B] truncate">
                {selectedTaskDetail.assignee.name}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8A857D] uppercase block mb-1">Due Date</span>
            <div className="flex items-center gap-1.5 text-[#18181B] pt-0.5 font-mono tabular-nums">
              <Calendar size={12} className="text-[#8A857D]" />
              <span>{selectedTaskDetail.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-[11px] font-bold text-[#18181B] uppercase tracking-wider mb-1">
            Acceptance Criteria & Context
          </h4>
          <p className="text-xs text-[#57534E] leading-relaxed bg-[#F6F5F2] p-3 rounded border border-[#E2DFD7]">
            {selectedTaskDetail.description || 'No detailed description provided for this deliverable.'}
          </p>
        </div>

        {/* Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-[11px] font-bold text-[#18181B] uppercase tracking-wider">
              Subtasks ({completedSubtasks}/{selectedTaskDetail.subtasks.length})
            </h4>
            <span className="text-[10px] font-mono tabular-nums text-[#8A857D]">
              {selectedTaskDetail.subtasks.length > 0
                ? Math.round((completedSubtasks / selectedTaskDetail.subtasks.length) * 100)
                : 0}
              % done
            </span>
          </div>

          <div className="space-y-1 bg-[#FAF9F7] p-2.5 rounded border border-[#E2DFD7]">
            {selectedTaskDetail.subtasks.map((st) => (
              <label
                key={st.id}
                className="flex items-center gap-2 p-1 rounded hover:bg-white transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => handleToggleSubtask(st.id)}
                  className="rounded text-[#18181B] focus:ring-stone-500 w-3.5 h-3.5"
                />
                <span
                  className={`text-xs ${
                    st.completed ? 'line-through text-[#8A857D]' : 'text-[#18181B]'
                  }`}
                >
                  {st.title}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Discussion */}
        <div>
          <h4 className="text-[11px] font-bold text-[#18181B] uppercase tracking-wider mb-1.5">
            Activity & Discussion
          </h4>
          <div className="space-y-1.5 mb-2.5">
            {mockComments.map((c) => (
              <div key={c.id} className="p-2 rounded bg-[#FAF9F7] border border-[#E2DFD7]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-[#18181B] text-[11px]">{c.user}</span>
                  <span className="text-[9px] text-[#8A857D] font-mono">{c.time}</span>
                </div>
                <p className="text-[11px] text-[#57534E]">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a comment..."
              className="flex-1 px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
            <Button variant="secondary" size="xs" type="submit" disabled={!commentText.trim()}>
              Comment
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
