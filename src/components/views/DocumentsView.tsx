import React, { useState } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Pin,
  ChevronRight,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { DocumentItem } from '../../types';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    activeDocument,
    setActiveDocument,
    setIsNewDocModalOpen,
    openAiAssistant,
    showToast,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = !searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'PRD', 'Specification', 'Design', 'Meeting Notes', 'Guidelines'];
  const activeSelectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleSummarizeDoc = (doc: DocumentItem) => {
    openAiAssistant({
      title: `Summary of ${doc.title}`,
      prompt: `Summarize key architectural requirements from document "${doc.title}".`,
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* HEADER */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">
              Workspace Knowledge & Specs
            </h1>
            <p className="text-xs text-[#57534E] mt-0.5">
              Product requirement briefs, API specifications, and shared team engineering notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() =>
                openAiAssistant({
                  title: 'Knowledge Base AI',
                  prompt: 'Search all team documents for typography math and offline cache specs.',
                })
              }
            >
              Search via AI
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<Plus size={12} />}
              onClick={() => setIsNewDocModalOpen(true)}
            >
              New Document
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#18181B] text-white font-bold'
                    : 'bg-[#F6F5F2] text-[#57534E] hover:text-[#18181B] border border-[#E2DFD7]'
                }`}
              >
                {cat === 'all' ? 'All Specs' : cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2 text-[#8A857D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter documents..."
              className="pl-7 pr-2.5 py-1 bg-[#F6F5F2] border border-[#E2DFD7] rounded text-xs text-[#18181B] placeholder:text-[#8A857D] focus:outline-none focus:border-[#18181B]"
            />
          </div>
        </div>
      </div>

      {/* DENSE SPLIT WORKSPACE INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Document Table / Index (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2DFD7] rounded-lg overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 bg-[#FAF9F7] border-b border-[#E2DFD7] flex items-center justify-between text-xs font-bold text-[#18181B]">
            <span>Documents Repository ({filteredDocs.length})</span>
            <span className="text-[11px] font-mono text-[#8A857D] font-normal">Sorted by recent edits</span>
          </div>

          <div className="divide-y divide-[#E2DFD7]">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F2EFE9] border-l-3 border-[#18181B]' : 'hover:bg-[#F6F5F2]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white text-[#57534E] font-semibold border border-[#E2DFD7]">
                        {doc.category}
                      </span>
                      {doc.isPinned && <Pin size={11} className="text-[#18181B]" />}
                    </div>

                    <h3 className="text-xs font-bold text-[#18181B] leading-snug truncate">
                      {doc.title}
                    </h3>

                    <p className="text-[11px] text-[#57534E] mt-1 line-clamp-1">
                      {doc.description}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-[10px] text-[#8A857D] font-mono">
                      <span>{doc.author.name}</span>
                      <span>·</span>
                      <span>{doc.updatedAt}</span>
                      <span>·</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>

                  <ChevronRight size={14} className={`shrink-0 mt-1 ${isSelected ? 'text-[#18181B]' : 'text-stone-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Rich Contextual Reader / Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 flex flex-col justify-between shadow-2xs">
          {activeSelectedDoc ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD7]">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-mono text-[#57534E] font-bold">
                    {activeSelectedDoc.category} Spec
                  </span>
                  <h2 className="text-sm font-bold text-[#18181B] leading-tight truncate mt-0.5">
                    {activeSelectedDoc.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={<Sparkles size={12} className="text-stone-700" />}
                    onClick={() => handleSummarizeDoc(activeSelectedDoc)}
                  >
                    Summarize
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => {
                      setActiveDocument(activeSelectedDoc);
                    }}
                  >
                    Expand
                  </Button>
                </div>
              </div>

              {/* Document Meta Attributes */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF9F7] rounded border border-[#E2DFD7] text-[11px]">
                <div>
                  <span className="text-[#8A857D] block text-[10px]">Owner</span>
                  <span className="font-semibold text-[#18181B]">{activeSelectedDoc.author.name}</span>
                </div>
                <div>
                  <span className="text-[#8A857D] block text-[10px]">Last Updated</span>
                  <span className="font-mono text-[#18181B]">{activeSelectedDoc.updatedAt}</span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="p-3 bg-[#F6F5F2] border border-[#E2DFD7] rounded text-xs text-[#18181B] font-mono leading-relaxed max-h-[360px] overflow-y-auto whitespace-pre-line">
                {activeSelectedDoc.content}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[#57534E]">
              Select a specification from the left to inspect content.
            </div>
          )}

          <div className="pt-4 border-t border-[#E2DFD7] flex items-center justify-between text-[11px] text-[#57534E]">
            <span>Version: 3.2 · Git Sync: Ready</span>
            <button
              onClick={() => showToast('Exported document markdown')}
              className="text-[#18181B] font-semibold hover:underline cursor-pointer"
            >
              Export Markdown →
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Document Modal */}
      {activeDocument && (
        <Modal
          isOpen={!!activeDocument}
          onClose={() => setActiveDocument(null)}
          title={activeDocument.title}
          description={`${activeDocument.category} · Author: ${activeDocument.author.name}`}
          maxWidth="2xl"
          footer={
            <Button variant="primary" size="sm" onClick={() => setActiveDocument(null)}>
              Done
            </Button>
          }
        >
          <div className="p-4 bg-[#F6F5F2] rounded border border-[#E2DFD7] text-xs font-mono text-[#18181B] leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto">
            {activeDocument.content}
          </div>
        </Modal>
      )}
    </div>
  );
};
