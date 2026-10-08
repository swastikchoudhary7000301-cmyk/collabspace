import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useWorkspace } from '../../context/WorkspaceContext';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, addProject } = useWorkspace();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('Oct 10, 2026');
  const [endDate, setEndDate] = useState('Nov 30, 2026');
  const [status, setStatus] = useState<'planning' | 'in_progress'>('planning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      status,
    });

    setName('');
    setDescription('');
    setIsNewProjectModalOpen(false);
  };

  return (
    <Modal
      isOpen={isNewProjectModalOpen}
      onClose={() => setIsNewProjectModalOpen(false)}
      title="Create New Project"
      description="Initiate a collaborative project container with sprints and timeline tracking."
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setIsNewProjectModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!name.trim()}>
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Project Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design System v3 & Token Pipeline"
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief scope, deliverables, and team goals..."
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Start Date</label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Target End Date</label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Initial Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
          >
            <option value="planning">Planning Phase</option>
            <option value="in_progress">In Active Development</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

export const NewDocModal: React.FC = () => {
  const { isNewDocModalOpen, setIsNewDocModalOpen, addDocument } = useWorkspace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'PRD' | 'Specification' | 'Design' | 'Meeting Notes' | 'Guidelines'>('Specification');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDocument({
      title: title.trim(),
      description: description.trim() || 'Specification document created in CollabSpace',
      category,
      content: content.trim() || `# ${title.trim()}\n\n## Overview\n\nDocument details and specifications.`,
    });

    setTitle('');
    setDescription('');
    setContent('');
    setIsNewDocModalOpen(false);
  };

  return (
    <Modal
      isOpen={isNewDocModalOpen}
      onClose={() => setIsNewDocModalOpen(false)}
      title="Create New Specification"
      description="Draft product requirements, technical blueprints, or architecture guidelines."
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setIsNewDocModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!title.trim()}>
            Create Document
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Document Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Real-Time WebSocket Synchronization Protocol"
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
          >
            <option value="Specification">Technical Specification</option>
            <option value="PRD">Product Requirements Document (PRD)</option>
            <option value="Design">Design Specs & Tokens</option>
            <option value="Guidelines">Engineering Guidelines</option>
            <option value="Meeting Notes">Architecture Sync Notes</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Summary Brief</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="One-line summary of requirements..."
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#18181B] mb-1">Initial Content (Markdown)</label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Introduction&#10;&#10;Key architecture and constraints..."
            className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] font-mono focus:outline-none focus:border-[#18181B]"
          />
        </div>
      </form>
    </Modal>
  );
};
