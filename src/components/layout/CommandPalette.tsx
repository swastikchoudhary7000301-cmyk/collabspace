import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FolderKanban,
  CheckSquare,
  FileText,
  CornerDownLeft,
  X,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    projects,
    tasks,
    documents,
    members,
    navigate,
    currentWorkspace,
    setSelectedTaskDetail,
    setActiveDocument,
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'projects' | 'files' | 'members'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setFilterType('all');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = projects.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
  const filteredDocs = documents.filter((d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q));
  const filteredMembers = members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.department.toLowerCase().includes(q));

  const handleSelectTask = (task: (typeof tasks)[0]) => {
    setIsCommandPaletteOpen(false);
    setSelectedTaskDetail(task);
    navigate(`/workspaces/${currentWorkspace.id}/tasks`);
  };

  const handleSelectDoc = (doc: (typeof documents)[0]) => {
    setIsCommandPaletteOpen(false);
    setActiveDocument(doc);
    navigate(`/workspaces/${currentWorkspace.id}/documents`);
  };

  const handleSelectProject = (project: (typeof projects)[0]) => {
    setIsCommandPaletteOpen(false);
    navigate(`/workspaces/${currentWorkspace.id}/projects/${project.id}`);
  };

  const handleSelectMember = () => {
    setIsCommandPaletteOpen(false);
    navigate(`/workspaces/${currentWorkspace.id}/members`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-900/30 backdrop-blur-2xs transition-opacity duration-150"
        onClick={() => setIsCommandPaletteOpen(false)}
        aria-hidden="true"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-[#E2DFD7] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E2DFD7] gap-2.5 bg-white">
          <Search size={16} className="text-[#8A857D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${currentWorkspace.name}...`}
            className="flex-1 bg-transparent text-xs text-[#18181B] placeholder:text-[#8A857D] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8A857D] hover:text-[#18181B] p-0.5 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
          <kbd className="text-[9px] font-mono text-[#57534E] bg-[#F6F5F2] border border-[#E2DFD7] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-[#FAF9F7] border-b border-[#E2DFD7] overflow-x-auto text-xs">
          {(['all', 'projects', 'tasks', 'files', 'members'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 rounded capitalize font-medium transition-colors cursor-pointer text-xs whitespace-nowrap ${
                filterType === type
                  ? 'bg-white text-[#18181B] font-bold border border-[#E2DFD7] shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              {type === 'all' ? 'All results' : type}
            </button>
          ))}
        </div>

        {/* Grouped Search Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#E2DFD7] text-xs">
          {/* Projects */}
          {(filterType === 'all' || filterType === 'projects') && filteredProjects.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[9px] font-bold text-[#8A857D] uppercase tracking-wider">
                Projects
              </div>
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#F6F5F2] group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <FolderKanban size={13} className="text-[#18181B]" />
                    <span className="font-semibold text-[#18181B]">{p.name}</span>
                    <span className="text-[10px] text-[#57534E]">· {p.progress}% complete</span>
                  </div>
                  <CornerDownLeft size={11} className="text-stone-300 group-hover:text-[#57534E]" />
                </button>
              ))}
            </div>
          )}

          {/* Tasks */}
          {(filterType === 'all' || filterType === 'tasks') && filteredTasks.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[9px] font-bold text-[#8A857D] uppercase tracking-wider">
                Tasks
              </div>
              {filteredTasks.slice(0, 5).map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTask(t)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#F6F5F2] group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckSquare size={13} className="text-[#8A857D] shrink-0" />
                    <span className="font-medium text-[#18181B] truncate">{t.title}</span>
                    <span className="text-[10px] text-[#57534E] shrink-0">· {t.dueDate}</span>
                  </div>
                  <span className="text-[10px] text-[#57534E] uppercase font-mono">{t.status.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          )}

          {/* Documents / Files */}
          {(filterType === 'all' || filterType === 'files') && filteredDocs.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[9px] font-bold text-[#8A857D] uppercase tracking-wider">
                Specifications & Files
              </div>
              {filteredDocs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDoc(d)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#F6F5F2] group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={13} className="text-[#18181B] shrink-0" />
                    <span className="font-semibold text-[#18181B] truncate">{d.title}</span>
                    <span className="text-[10px] text-[#57534E] shrink-0">· {d.category}</span>
                  </div>
                  <span className="text-[10px] text-[#57534E] font-mono">{d.fileSize}</span>
                </button>
              ))}
            </div>
          )}

          {/* Members */}
          {(filterType === 'all' || filterType === 'members') && filteredMembers.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[9px] font-bold text-[#8A857D] uppercase tracking-wider">
                Team
              </div>
              {filteredMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={handleSelectMember}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#F6F5F2] group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      referrerPolicy="no-referrer"
                      className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                    />
                    <span className="font-medium text-[#18181B]">{m.name}</span>
                    <span className="text-[11px] text-[#57534E]">· {m.title}</span>
                  </div>
                  <span className="text-[10px] text-[#57534E] font-mono">{m.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3.5 py-2 bg-[#F6F5F2] border-t border-[#E2DFD7] flex items-center justify-between text-[10px] text-[#57534E]">
          <span>Type to filter across workspace items</span>
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white border border-[#E2DFD7] px-1 py-0.2 rounded">▲ ▼</kbd> Move
            </span>
            <span>
              <kbd className="font-mono bg-white border border-[#E2DFD7] px-1 py-0.2 rounded">↵</kbd> Select
            </span>
            <span>
              <kbd className="font-mono bg-white border border-[#E2DFD7] px-1 py-0.2 rounded">esc</kbd> Cancel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
