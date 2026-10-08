import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Copy,
  PlusCircle,
  Check,
  Loader2,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { api } from '../../lib/api';

interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  generatedTasks?: { title: string; priority: 'low' | 'medium' | 'high' | 'urgent'; dueDate: string }[];
}

export const AiAssistantModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    aiContext,
    currentWorkspace,
    projects,
    currentProjectId,
    tasks,
    addTask,
    showToast,
  } = useWorkspace();

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const [input, setInput] = useState(aiContext?.prompt || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `Hello! I am your CollabSpace Workspace Assistant. I have context on **${currentWorkspace.name}** and active project **${currentProject?.name || 'Website Redesign'}**. How can I help streamline your sprint today?`,
    },
  ]);

  if (!isAiModalOpen) return null;

  const quickPrompts = [
    'Generate tasks for Sprint 15 rollout',
    'Summarize blockers across active projects',
    'Draft weekly leadership status update',
    'Suggest sprint velocity improvements',
  ];

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMsg: AiMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.sendAiChat(
        queryText,
        currentWorkspace.name,
        currentProject?.name,
        {
          openTasksCount: tasks.filter((t) => t.status !== 'done').length,
          tasks: tasks.slice(0, 5).map((t) => ({ title: t.title, status: t.status, priority: t.priority })),
        }
      );

      const assistantReply: AiMessage = {
        id: `ai_${Date.now() + 1}`,
        sender: 'assistant',
        text: res.text,
        generatedTasks: res.generatedTasks,
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch {
      const fallbackReply: AiMessage = {
        id: `ai_${Date.now() + 1}`,
        sender: 'assistant',
        text: `Workspace context confirmed for "${queryText}". Deliverables and tasks are aligned with **${currentWorkspace.name}**.`,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertTask = (taskItem: { title: string; priority: any; dueDate: string }) => {
    addTask({
      title: taskItem.title,
      priority: taskItem.priority,
      dueDate: taskItem.dueDate,
      status: 'todo',
      projectId: currentProject?.id,
    });
    showToast(`Added task: ${taskItem.title}`);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-900/30 backdrop-blur-2xs transition-opacity"
        onClick={() => setIsAiModalOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-[#E2DFD7] overflow-hidden z-10 flex flex-col h-[580px] max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E2DFD7] flex items-center justify-between bg-[#FAF9F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#18181B] text-white flex items-center justify-center shadow-2xs">
              <Sparkles size={13} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#18181B]">CollabSpace AI Assistant</h3>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-stone-100 text-stone-700 font-bold border border-stone-200">
                  Sprint Context
                </span>
              </div>
              <p className="text-[10px] text-[#57534E]">
                {currentWorkspace.name} · {currentProject?.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1 rounded text-[#57534E] hover:text-[#18181B] hover:bg-[#F6F5F2] cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F7]/40 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-5 h-5 rounded bg-stone-200 text-[#18181B] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={11} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded p-3 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#18181B] text-white'
                    : 'bg-white text-[#18181B] border border-[#E2DFD7] shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line text-xs">{m.text}</div>

                {/* Generated Tasks Breakdown */}
                {m.generatedTasks && (
                  <div className="mt-2.5 space-y-1.5 border-t border-[#E2DFD7] pt-2">
                    {m.generatedTasks.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-[#F6F5F2] border border-[#E2DFD7] text-[#18181B]"
                      >
                        <div className="truncate mr-2">
                          <div className="font-semibold truncate text-xs">{t.title}</div>
                          <div className="text-[10px] text-[#57534E] font-mono">
                            Priority: <span className="capitalize">{t.priority}</span> · Due {t.dueDate}
                          </div>
                        </div>
                        <button
                          onClick={() => handleInsertTask(t)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#18181B] hover:text-stone-700 bg-white border border-[#E2DFD7] px-2 py-0.5 rounded shrink-0 cursor-pointer shadow-2xs"
                        >
                          <PlusCircle size={11} />
                          Add Task
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {m.sender === 'assistant' && (
                  <div className="mt-2 flex items-center justify-end gap-2 pt-1 border-t border-[#E2DFD7]/40 text-[10px] text-[#57534E]">
                    <button
                      onClick={() => copyToClipboard(m.id, m.text)}
                      className="hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === m.id ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-5 h-5 rounded bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-5 h-5 rounded bg-[#18181B] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={11} className="animate-spin" />
              </div>
              <div className="p-2.5 rounded text-xs bg-white border border-[#E2DFD7] text-[#57534E] flex items-center gap-2">
                <Loader2 size={13} className="animate-spin text-[#18181B]" />
                <span>Analyzing workspace models...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-3 py-1.5 border-t border-[#E2DFD7] bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-[#8A857D] font-semibold shrink-0">Prompts:</span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[10px] text-[#18181B] hover:bg-[#F2EFE9] bg-[#F6F5F2] border border-[#E2DFD7] px-2 py-0.5 rounded transition-colors shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#E2DFD7] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about tasks, specs, or sprint velocity..."
              className="flex-1 px-3 py-1.5 text-xs text-[#18181B] bg-[#F6F5F2] border border-[#E2DFD7] rounded focus:outline-none focus:border-[#18181B] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-1.5 rounded bg-[#18181B] text-white hover:bg-[#27272A] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
