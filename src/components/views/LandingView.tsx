import React, { useState } from 'react';
import {
  ArrowRight,
  FolderKanban,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
  Calendar,
  FileText,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { BrandLogo } from '../ui/BrandLogo';

export const LandingView: React.FC = () => {
  const { navigate, currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'board' | 'chat' | 'docs'>('board');

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#18181B] selection:bg-stone-200 selection:text-stone-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#F6F5F2]/90 backdrop-blur-md border-b border-[#E2DFD7] px-6 lg:px-12 py-3 flex items-center justify-between">
        <BrandLogo size="md" onClick={() => navigate('/')} />

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#57534E]">
          <a href="#overview" className="hover:text-[#18181B] transition-colors">Overview</a>
          <a href="#projects" className="hover:text-[#18181B] transition-colors">Projects</a>
          <a href="#collaboration" className="hover:text-[#18181B] transition-colors">Team Chat</a>
          <a href="#docs" className="hover:text-[#18181B] transition-colors">Specifications</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-[#18181B] hover:text-stone-700 px-2.5 py-1 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <Button
            variant="primary"
            size="xs"
            onClick={() => navigate(`/workspaces/${currentWorkspace.id}`)}
          >
            Launch Workspace
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-6 lg:px-12 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded mb-5">
          <Sparkles size={12} className="text-stone-800" />
          <span>Unified Team Operating Environment</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#18181B] tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Work together. <br className="hidden sm:inline" />
          <span>Build with precision.</span>
        </h1>

        <p className="mt-4 text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
          CollabSpace unifies projects, sprint deliverables, real-time messaging, and living specifications into one calm, high-density workspace.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight size={14} />}
            onClick={() => navigate(`/workspaces/${currentWorkspace.id}`)}
          >
            Open Interactive Workspace
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/register')}
          >
            Create Free Account
          </Button>
        </div>

        {/* Live Interface Preview Window */}
        <div className="mt-12 bg-white rounded-lg border border-[#E2DFD7] shadow-sm overflow-hidden text-left">
          {/* Top Window Bar */}
          <div className="px-4 py-2.5 border-b border-[#E2DFD7] bg-[#FAF9F7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="ml-2 text-xs font-bold text-[#18181B]">Acme Workspace / Website Redesign</span>
            </div>

            <div className="flex items-center gap-1 bg-[#F1F0ED] p-0.5 rounded border border-[#E2DFD7] text-xs">
              <button
                onClick={() => setActiveTab('board')}
                className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer font-medium ${
                  activeTab === 'board' ? 'bg-white text-[#18181B] font-bold shadow-2xs' : 'text-[#57534E]'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer font-medium ${
                  activeTab === 'chat' ? 'bg-white text-[#18181B] font-bold shadow-2xs' : 'text-[#57534E]'
                }`}
              >
                Team Chat
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer font-medium ${
                  activeTab === 'docs' ? 'bg-white text-[#18181B] font-bold shadow-2xs' : 'text-[#57534E]'
                }`}
              >
                Specifications
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 bg-[#FAF9F7]/40">
            {activeTab === 'board' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#F6F5F2] p-3 rounded border border-[#E2DFD7]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#18181B] mb-2">
                    <span>TO DO</span>
                    <span className="font-mono text-[10px] text-[#8A857D]">2</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#E2DFD7] shadow-2xs">
                    <span className="text-[10px] font-semibold text-amber-700">High</span>
                    <div className="text-xs font-semibold text-[#18181B] mt-0.5">Landing Page Redesign</div>
                    <div className="text-[10px] text-[#57534E] mt-1 font-mono">Due Oct 19 · 0/3 subtasks</div>
                  </div>
                </div>

                <div className="bg-[#F6F5F2] p-3 rounded border border-[#E2DFD7]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#18181B] mb-2">
                    <span>IN PROGRESS</span>
                    <span className="font-mono text-[10px] text-blue-700">3</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-stone-300 shadow-2xs">
                    <span className="text-[10px] font-semibold text-rose-700">Urgent</span>
                    <div className="text-xs font-semibold text-[#18181B] mt-0.5">Notification System UI</div>
                    <div className="text-[10px] text-[#57534E] mt-1 font-mono">Due Oct 14 · 1/2 subtasks</div>
                  </div>
                </div>

                <div className="bg-[#F6F5F2] p-3 rounded border border-[#E2DFD7]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#18181B] mb-2">
                    <span>DONE</span>
                    <span className="font-mono text-[10px] text-emerald-700">4</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#E2DFD7] shadow-2xs">
                    <span className="text-[10px] font-semibold text-emerald-700">Completed</span>
                    <div className="text-xs font-semibold text-[#18181B] mt-0.5">Mobile App Architecture</div>
                    <div className="text-[10px] text-[#57534E] mt-1 font-mono">Sep 29 · 3/3 done</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white p-4 rounded border border-[#E2DFD7] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-2 text-xs">
                  <span className="font-bold text-[#18181B]">#product-dev (18 members)</span>
                  <span className="text-[#8A857D] font-mono text-[10px]">Active conversation</span>
                </div>
                <div className="flex gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-[#18181B] font-bold flex items-center justify-center text-xs shrink-0">
                    P
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#18181B]">Priya Patel</span>
                      <span className="text-[10px] text-[#8A857D] font-mono">10:14 AM</span>
                    </div>
                    <p className="text-[#57534E]">
                      I've attached the latest design reference and typography matrix. Notice how the three-column chat provides instant context without leaving the sprint.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="bg-white p-4 rounded border border-[#E2DFD7] text-xs space-y-2 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-2">
                  <span className="font-bold text-[#18181B]">CollabSpace Product Requirements Document</span>
                  <span className="text-[10px] font-mono text-[#8A857D]">Updated 2h ago</span>
                </div>
                <p className="text-[#57534E] leading-relaxed">
                  CollabSpace combines projects, high-density task execution, real-time channels, and specifications into an intentional, high-density environment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="projects" className="py-16 px-6 lg:px-12 max-w-5xl mx-auto border-t border-[#E2DFD7]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-lg border border-[#E2DFD7] shadow-2xs">
            <FolderKanban size={18} className="text-[#18181B] mb-3" />
            <h3 className="font-bold text-sm text-[#18181B]">High-Density Projects</h3>
            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
              Multi-view projects supporting dense list views, four-column Kanban, milestone timelines, and sprint metrics.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-[#E2DFD7] shadow-2xs">
            <MessageSquare size={18} className="text-[#18181B] mb-3" />
            <h3 className="font-bold text-sm text-[#18181B]">Integrated Team Chat</h3>
            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
              Persistent channel navigation, active thread conversation, and contextual sidebar with pinned deliverables.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-[#E2DFD7] shadow-2xs">
            <Sparkles size={18} className="text-[#18181B] mb-3" />
            <h3 className="font-bold text-sm text-[#18181B]">Contextual AI Layer</h3>
            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
              Grounded in current sprint context for instant task breakdown, deliverable summarization, and blocker detection.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 lg:px-12 bg-white border-t border-[#E2DFD7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#57534E] gap-3">
        <BrandLogo size="sm" />
        <div>© 2026 CollabSpace Inc. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="hover:text-[#18181B] cursor-pointer">Sign In</button>
          <button onClick={() => navigate('/register')} className="hover:text-[#18181B] cursor-pointer">Register</button>
          <button onClick={() => navigate(`/workspaces/${currentWorkspace.id}`)} className="hover:text-[#18181B] cursor-pointer font-semibold text-[#18181B]">Launch App</button>
        </div>
      </footer>
    </div>
  );
};
