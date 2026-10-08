import React, { useState } from 'react';
import {
  Hash,
  Plus,
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  FileText,
  Pin,
  CheckCheck,
  Download,
  Code,
  Bold,
  Italic,
  Link,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { mockChannels, mockDirectMessages, mockUsers } from '../../mock/data';

export const ChatView: React.FC = () => {
  const {
    currentUser,
    activeChannelId,
    activeDmId,
    setActiveChannel,
    setActiveDm,
    messages,
    sendMessage,
    openAiAssistant,
    showToast,
  } = useWorkspace();

  const [messageInput, setMessageInput] = useState('');
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(true);
  const [searchChannelQuery, setSearchChannelQuery] = useState('');

  const activeChannel = mockChannels.find((c) => c.id === activeChannelId) || mockChannels[0];
  const activeDm = mockDirectMessages.find((d) => d.id === activeDmId);

  const activeMessageKey = activeDmId || activeChannelId || 'chn_product';
  const currentMessages = messages[activeMessageKey] || messages['chn_product'] || [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleAttachMockFile = () => {
    sendMessage("I've attached the latest design reference and typography matrix.", {
      name: 'CollabSpace_Sprint15_Tokens.figma',
      size: '14.8 MB',
      type: 'figma',
    });
    showToast('File attached to conversation');
  };

  return (
    <div className="h-[calc(100vh-3rem)] flex overflow-hidden bg-white border-b border-[#E2DFD7]">
      {/* COLUMN 1: Channels and DMs List */}
      <div className="w-64 border-r border-[#E2DFD7] bg-[#F6F5F2] flex flex-col justify-between shrink-0">
        <div className="p-3 border-b border-[#E2DFD7]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#18181B] tracking-wider uppercase">
              Messages & Channels
            </h2>
            <button
              onClick={() => showToast('New channel creation dialog')}
              className="p-1 rounded text-[#57534E] hover:text-[#18181B] hover:bg-[#F2EFE9] cursor-pointer"
              title="Create Channel"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2 text-[#8A857D]" />
            <input
              type="text"
              value={searchChannelQuery}
              onChange={(e) => setSearchChannelQuery(e.target.value)}
              placeholder="Filter channels..."
              className="w-full pl-7 pr-2.5 py-1 bg-white border border-[#E2DFD7] rounded text-xs text-[#18181B] placeholder:text-[#8A857D] focus:outline-none focus:border-[#18181B]"
            />
          </div>
        </div>

        {/* Scrollable Channels & DMs */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Channels Group */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold text-[#8A857D] uppercase tracking-wider">
              Channels ({mockChannels.length})
            </div>
            <div className="space-y-0.5 mt-0.5">
              {mockChannels.map((c) => {
                const isActive = activeChannelId === c.id && !activeDmId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveChannel(c.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#18181B] font-bold shadow-2xs border border-[#E2DFD7]'
                        : 'text-[#57534E] hover:bg-[#EFECE5] hover:text-[#18181B]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash size={13} className={isActive ? 'text-[#18181B]' : 'text-[#8A857D]'} />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded bg-[#18181B] text-white font-bold">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Messages Group */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold text-[#8A857D] uppercase tracking-wider">
              Direct Messages
            </div>
            <div className="space-y-0.5 mt-0.5">
              {mockDirectMessages.map((dm) => {
                const isActive = activeDmId === dm.id;
                return (
                  <button
                    key={dm.id}
                    onClick={() => setActiveDm(dm.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#18181B] font-bold shadow-2xs border border-[#E2DFD7]'
                        : 'text-[#57534E] hover:bg-[#EFECE5] hover:text-[#18181B]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="relative">
                        <img
                          src={dm.user.avatar}
                          alt={dm.user.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ring-1 ring-white ${
                            dm.user.status === 'online' ? 'bg-emerald-600' : 'bg-stone-400'
                          }`}
                        />
                      </div>
                      <span className="truncate">{dm.user.name}</span>
                    </div>
                    {dm.unreadCount > 0 && (
                      <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded bg-stone-200 text-[#18181B] font-bold">
                        {dm.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 2: Center Conversation Viewport */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
        {/* Conversation Header */}
        <div className="h-12 px-4 md:px-5 border-b border-[#E2DFD7] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            {activeDm ? (
              <div className="flex items-center gap-2">
                <img
                  src={activeDm.user.avatar}
                  alt={activeDm.user.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                />
                <div>
                  <span className="font-bold text-xs text-[#18181B]">{activeDm.user.name}</span>
                  <span className="text-[10px] text-emerald-700 font-medium ml-2">● Online</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded bg-stone-100 text-[#18181B] border border-stone-200 flex items-center justify-center font-bold text-xs">
                  #
                </div>
                <div className="truncate">
                  <span className="font-bold text-xs text-[#18181B] mr-2">
                    {activeChannel.name}
                  </span>
                  <span className="text-[11px] text-[#57534E] hidden md:inline truncate">
                    {activeChannel.description}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => showToast('Connecting workspace voice huddle...')}
              className="p-1.5 text-[#57534E] hover:text-[#18181B] hover:bg-[#F6F5F2] rounded cursor-pointer"
              title="Voice Call"
            >
              <Phone size={14} />
            </button>
            <button
              onClick={() => showToast('Starting video conference...')}
              className="p-1.5 text-[#57534E] hover:text-[#18181B] hover:bg-[#F6F5F2] rounded cursor-pointer"
              title="Video Call"
            >
              <Video size={14} />
            </button>
            <button
              onClick={() => setDetailsPanelOpen(!detailsPanelOpen)}
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                detailsPanelOpen ? 'bg-[#F2EFE9] text-[#18181B]' : 'text-[#57534E] hover:bg-[#F6F5F2]'
              }`}
              title="Toggle Details"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {/* Pinned Announcement Strip */}
        <div className="px-4 py-1.5 bg-[#FAF9F7] border-b border-[#E2DFD7] flex items-center justify-between text-[11px] text-[#57534E]">
          <div className="flex items-center gap-1.5 truncate">
            <Pin size={11} className="text-stone-700 shrink-0" />
            <span className="truncate">
              <strong>Pinned:</strong> Sprint 15 code freeze on Friday 5PM EST. Link all PRs to task boards.
            </span>
          </div>
          <button
            onClick={() => showToast('Opened pinned notice')}
            className="text-[10px] text-[#18181B] font-semibold hover:underline shrink-0 ml-2"
          >
            Details
          </button>
        </div>

        {/* Real Message Thread */}
        <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-4 bg-[#FAF9F7]/40">
          {/* Date Separator */}
          <div className="flex items-center justify-center my-2">
            <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-mono text-[#8A857D] border border-stone-200">
              Today, October 6, 2026
            </span>
          </div>

          {currentMessages.map((msg) => {
            const isMe = msg.sender.id === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs group ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.sender.avatar}
                    alt={msg.sender.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-[#E2DFD7]"
                  />
                )}

                <div className={`max-w-xl space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Timestamp */}
                  <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-bold text-[11px] text-[#18181B]">{msg.sender.name}</span>
                    <span className="text-[10px] text-[#8A857D] font-mono tabular-nums">{msg.timestamp}</span>
                  </div>

                  {/* Speech Bubble */}
                  <div
                    className={`p-3 rounded-lg leading-relaxed text-xs ${
                      isMe
                        ? 'bg-[#18181B] text-white shadow-2xs'
                        : 'bg-white text-[#18181B] border border-[#E2DFD7] shadow-2xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Attached File Card */}
                    {msg.attachment && (
                      <div
                        onClick={() => showToast(`Downloading ${msg.attachment?.name}`)}
                        className={`mt-2.5 p-2 rounded border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isMe
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                            : 'bg-[#F6F5F2] border-[#E2DFD7] text-[#18181B] hover:bg-[#F2EFE9]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={16} className={isMe ? 'text-stone-300' : 'text-stone-700'} />
                          <div className="truncate text-left">
                            <div className="font-semibold text-xs truncate">{msg.attachment.name}</div>
                            <div className="text-[10px] opacity-75 font-mono">{msg.attachment.size} · verified</div>
                          </div>
                        </div>
                        <Download size={13} className="shrink-0 opacity-70" />
                      </div>
                    )}
                  </div>

                  {/* Reactions & Thread Counter */}
                  <div className={`flex items-center gap-1.5 pt-0.5 ${isMe ? 'justify-end' : ''}`}>
                    {msg.reactions && msg.reactions.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(`Added ${r.emoji}`)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-[#F2EFE9] text-[10px] text-[#18181B] border border-[#E2DFD7] cursor-pointer"
                      >
                        <span>{r.emoji}</span>
                        <span className="font-mono text-[9px] text-[#57534E]">{r.count}</span>
                      </button>
                    ))}

                    {msg.repliesCount && (
                      <span
                        onClick={() => showToast(`Opening thread with ${msg.repliesCount} replies`)}
                        className="text-[10px] text-[#18181B] font-semibold hover:underline cursor-pointer pl-1"
                      >
                        {msg.repliesCount} replies
                      </span>
                    )}

                    {isMe && (
                      <CheckCheck size={12} className="text-stone-400 ml-1" />
                    )}
                  </div>
                </div>

                {isMe && (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-[#E2DFD7]"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Message Composer Bar */}
        <div className="p-3 border-t border-[#E2DFD7] bg-white">
          <form onSubmit={handleSend} className="space-y-1.5">
            {/* Formatting Toolbar */}
            <div className="flex items-center justify-between text-xs px-1 text-[#8A857D]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMessageInput((prev) => prev + '**bold** ')}
                  className="p-1 hover:text-[#18181B] rounded hover:bg-[#F6F5F2]"
                  title="Bold"
                >
                  <Bold size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setMessageInput((prev) => prev + '_italic_ ')}
                  className="p-1 hover:text-[#18181B] rounded hover:bg-[#F6F5F2]"
                  title="Italic"
                >
                  <Italic size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setMessageInput((prev) => prev + '`code` ')}
                  className="p-1 hover:text-[#18181B] rounded hover:bg-[#F6F5F2]"
                  title="Code snippet"
                >
                  <Code size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleAttachMockFile}
                  className="p-1 hover:text-[#18181B] rounded hover:bg-[#F6F5F2]"
                  title="Attach file"
                >
                  <Paperclip size={13} />
                </button>
              </div>

              <span className="text-[10px] font-mono text-[#8A857D]">
                Press ⏎ to send
              </span>
            </div>

            <div className="flex items-center gap-2 p-1.5 border border-[#E2DFD7] rounded-md bg-[#F6F5F2] focus-within:bg-white focus-within:border-[#18181B] transition-colors">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message #${activeChannel.name}...`}
                className="flex-1 bg-transparent text-xs text-[#18181B] focus:outline-none px-1"
              />

              <button
                type="button"
                onClick={() => sendMessage('Acknowledged deliverable status 👍')}
                className="p-1 text-[#57534E] hover:text-[#18181B] rounded cursor-pointer"
                title="Add Reaction"
              >
                <Smile size={15} />
              </button>

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-2.5 py-1 rounded bg-[#18181B] text-white hover:bg-[#27272A] disabled:opacity-30 transition-colors cursor-pointer text-xs font-medium flex items-center gap-1 shadow-2xs"
              >
                <Send size={12} />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* COLUMN 3: Channel Info & Pinned Files */}
      {detailsPanelOpen && (
        <div className="w-64 border-l border-[#E2DFD7] bg-[#FAF9F7] p-4 space-y-4 overflow-y-auto text-xs hidden lg:block shrink-0">
          <div>
            <div className="text-[10px] font-bold text-[#8A857D] uppercase tracking-wider mb-1">
              About Channel
            </div>
            <h3 className="font-bold text-[#18181B] text-sm">#{activeChannel.name}</h3>
            <p className="text-[#57534E] text-[11px] mt-1 leading-relaxed">
              {activeChannel.description}
            </p>
          </div>

          {/* Members in Conversation */}
          <div className="pt-3 border-t border-[#E2DFD7]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#8A857D] uppercase tracking-wider">
                Members ({activeChannel.membersCount})
              </span>
              <button
                onClick={() => showToast('Invite collaborator modal')}
                className="text-[10px] text-[#18181B] font-semibold hover:underline cursor-pointer"
              >
                + Add
              </button>
            </div>

            <div className="space-y-1.5 mt-2">
              {mockUsers.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                    />
                    <span className="truncate text-[#18181B] font-medium">{m.name}</span>
                  </div>
                  <span className="text-[10px] text-[#8A857D] font-mono">{m.department.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pinned Files */}
          <div className="pt-3 border-t border-[#E2DFD7]">
            <span className="text-[10px] font-bold text-[#8A857D] uppercase tracking-wider block mb-2">
              Pinned Files & Specs
            </span>
            <div className="space-y-2">
              <div
                onClick={() => showToast('Opening Figma token reference')}
                className="p-2 rounded bg-white border border-[#E2DFD7] text-[11px] cursor-pointer hover:border-[#18181B] transition-colors shadow-2xs"
              >
                <div className="font-semibold text-[#18181B] truncate">workspace_design_tokens.figma</div>
                <div className="text-[#8A857D] text-[10px] font-mono mt-0.5">18.6 MB · Priya Patel</div>
              </div>

              <div
                onClick={() => showToast('Opening PDF Architecture')}
                className="p-2 rounded bg-white border border-[#E2DFD7] text-[11px] cursor-pointer hover:border-[#18181B] transition-colors shadow-2xs"
              >
                <div className="font-semibold text-[#18181B] truncate">collabspace_architecture_v3.pdf</div>
                <div className="text-[#8A857D] text-[10px] font-mono mt-0.5">3.4 MB · Arjun Mehta</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
