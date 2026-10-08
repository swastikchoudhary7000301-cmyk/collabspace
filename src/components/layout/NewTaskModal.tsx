import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Priority, TaskStatus } from '../../types';

export const NewTaskModal: React.FC = () => {
  const {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    projects,
    currentProjectId,
    members,
    addTask,
  } = useWorkspace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(currentProjectId);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState(members[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-10-20');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, { id: `st_${Date.now()}`, title: subtaskInput.trim(), completed: false }]);
    setSubtaskInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = members.find((m) => m.id === assigneeId) || members[0];
    const project = projects.find((p) => p.id === projectId) || projects[0];

    addTask({
      title: title.trim(),
      description: description.trim(),
      projectId: project.id,
      projectName: project.name,
      status,
      priority,
      assignee,
      dueDate,
      subtasks,
      tags: ['Sprint Deliverable'],
    });

    setTitle('');
    setDescription('');
    setSubtasks([]);
    setIsNewTaskModalOpen(false);
  };

  return (
    <Modal
      isOpen={isNewTaskModalOpen}
      onClose={() => setIsNewTaskModalOpen(false)}
      title="Create New Task"
      description="Add an actionable deliverable to your project roadmap."
      maxWidth="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setIsNewTaskModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!title.trim()}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title */}
        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement Responsive Drawer Animation"
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key acceptance criteria, links to Figma tokens, or context..."
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
          />
        </div>

        {/* Project & Status Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Status Column</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white capitalize"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* Priority & Assignee & Due Date Row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white capitalize"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Assignee</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
            />
          </div>
        </div>

        {/* Subtasks */}
        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Subtasks Checklist</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="Add actionable checklist item..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              className="flex-1 px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
            <Button variant="secondary" size="xs" type="button" onClick={handleAddSubtask}>
              Add
            </Button>
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-1 bg-[#FAF9F7] p-2 rounded border border-[#E2DFD7] max-h-32 overflow-y-auto">
              {subtasks.map((st, i) => (
                <div key={st.id} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-[#18181B]">· {st.title}</span>
                  <button
                    type="button"
                    onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))}
                    className="text-[#8A857D] hover:text-[#18181B] cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
