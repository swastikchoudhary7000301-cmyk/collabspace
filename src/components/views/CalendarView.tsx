import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { mockCalendarEvents } from '../../mock/data';
import { CalendarEvent } from '../../types';

export const CalendarView: React.FC = () => {
  const { openAiAssistant, showToast } = useWorkspace();

  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week');
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-10-09');
  const [newEventTime, setNewEventTime] = useState('11:00');
  const [newEventType, setNewEventType] = useState<'task' | 'meeting' | 'review' | 'deadline' | 'sprint'>('meeting');

  const daysOfWeek = [
    { day: 'Mon', num: '05', isToday: false },
    { day: 'Tue', num: '06', isToday: false },
    { day: 'Wed', num: '07', isToday: true },
    { day: 'Thu', num: '08', isToday: false },
    { day: 'Fri', num: '09', isToday: false },
    { day: 'Sat', num: '10', isToday: false },
    { day: 'Sun', num: '11', isToday: false },
  ];

  const hours = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `ev_${Date.now()}`,
      title: newEventTitle.trim(),
      startDate: newEventDate,
      endDate: newEventDate,
      startTime: newEventTime,
      endTime: '12:00',
      type: newEventType,
      priority: 'high',
      assignedUsers: [],
      color: '#18181B',
    };

    setEvents([...events, newEv]);
    setIsAddEventOpen(false);
    setNewEventTitle('');
    showToast(`Event scheduled: ${newEv.title}`);
  };

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* CALENDAR HEADER */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">
              05–11 October 2026
            </h1>

            <div className="flex items-center border border-[#E2DFD7] rounded overflow-hidden text-xs">
              <button
                onClick={() => showToast('Previous week')}
                className="p-1 hover:bg-[#F6F5F2] text-[#57534E] cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => showToast('Current week')}
                className="px-2.5 py-0.5 font-semibold text-[#18181B] border-x border-[#E2DFD7] bg-[#F6F5F2]"
              >
                This Week
              </button>
              <button
                onClick={() => showToast('Next week')}
                className="p-1 hover:bg-[#F6F5F2] text-[#57534E] cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* View switcher */}
            <div className="flex items-center bg-[#F6F5F2] border border-[#E2DFD7] p-0.5 rounded text-xs font-medium">
              {(['month', 'week', 'day'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setCalendarView(v)}
                  className={`px-2.5 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                    calendarView === v
                      ? 'bg-white text-[#18181B] font-bold shadow-2xs'
                      : 'text-[#57534E] hover:text-[#18181B]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() =>
                openAiAssistant({
                  title: 'Schedule Assistant',
                  prompt: 'Scan upcoming week deadlines and identify time conflicts.',
                })
              }
            >
              Ask AI
            </Button>

            <Button
              variant="primary"
              size="xs"
              icon={<Plus size={12} />}
              onClick={() => setIsAddEventOpen(true)}
            >
              Add Event
            </Button>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#8A857D] font-medium mr-1 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'sprint', label: 'Sprints' },
            { id: 'review', label: 'Design Reviews' },
            { id: 'meeting', label: 'Architecture Syncs' },
            { id: 'deadline', label: 'Key Deadlines' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
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

      {/* SCHEDULE GRID CANVAS */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg overflow-hidden shadow-2xs">
        {/* Days of Week Header */}
        <div className="grid grid-cols-8 border-b border-[#E2DFD7] bg-[#FAF9F7] text-xs font-semibold text-center">
          <div className="p-2.5 border-r border-[#E2DFD7] text-[#8A857D] font-mono text-[11px]">
            GMT-7
          </div>
          {daysOfWeek.map((d) => (
            <div
              key={d.day}
              className={`p-2.5 border-r border-[#E2DFD7] last:border-0 ${
                d.isToday
                  ? 'bg-[#18181B] text-white font-bold'
                  : 'text-[#18181B]'
              }`}
            >
              <span>{d.num} · {d.day}</span>
            </div>
          ))}
        </div>

        {/* Hour Slots Matrix with Live Marker */}
        <div className="divide-y divide-[#E2DFD7] relative">
          {/* Horizontal Current Time Indicator Line */}
          <div className="absolute top-[175px] left-0 right-0 z-20 pointer-events-none flex items-center">
            <span className="bg-[#18181B] text-white font-mono text-[9px] px-1.5 py-0.5 rounded-r font-bold">
              10:45
            </span>
            <div className="h-[2px] bg-[#18181B] flex-1" />
          </div>

          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[58px]">
              {/* Hour Label */}
              <div className="p-2 border-r border-[#E2DFD7] text-[10px] font-mono text-[#8A857D] text-center bg-[#FAF9F7]/70">
                {hour}
              </div>

              {/* Day Slot Cells */}
              {daysOfWeek.map((d, dIdx) => {
                const matchingEvent = filteredEvents.find((e) => {
                  if (dIdx === 2 && hour === '09:00' && e.id === 'ev_1') return true;
                  if (dIdx === 2 && hour === '13:00' && e.id === 'ev_2') return true;
                  if (dIdx === 3 && hour === '11:00' && e.id === 'ev_4') return true;
                  if (dIdx === 3 && hour === '15:00' && e.id === 'ev_7') return true;
                  if (dIdx === 4 && hour === '14:00' && e.id === 'ev_5') return true;
                  if (dIdx === 5 && hour === '17:00' && e.id === 'ev_3') return true;
                  return false;
                });

                return (
                  <div
                    key={d.day}
                    onClick={() => {
                      setNewEventTime(hour);
                      setIsAddEventOpen(true);
                    }}
                    className="p-1 border-r border-[#E2DFD7] last:border-0 hover:bg-[#F6F5F2] transition-colors relative cursor-pointer"
                  >
                    {matchingEvent && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Event: ${matchingEvent.title}`);
                        }}
                        className="p-2 rounded bg-stone-100/90 hover:bg-stone-200/90 border border-stone-300/80 shadow-2xs text-left cursor-pointer transition-all h-full flex flex-col justify-between"
                      >
                        <div className="text-[11px] font-bold text-[#18181B] truncate">
                          {matchingEvent.title}
                        </div>
                        <div className="text-[10px] text-[#57534E] font-mono tabular-nums mt-1 flex items-center justify-between">
                          <span>{matchingEvent.startTime}–{matchingEvent.endTime}</span>
                          <span className="capitalize font-semibold text-stone-700 bg-white px-1 py-0.2 rounded border border-stone-200">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Schedule Milestone or Meeting"
        description="Book sprint review, keynote sync, or deliverable deadline."
        maxWidth="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateEvent} disabled={!newEventTitle.trim()}>
              Save Event
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="e.g. Design Tokens Spec Sign-Off"
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#18181B] mb-1">Date</label>
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#18181B] mb-1">Start Time</label>
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Event Category</label>
            <select
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value as any)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white capitalize"
            >
              <option value="meeting">Architecture Sync</option>
              <option value="review">Design / Code Review</option>
              <option value="sprint">Sprint Ceremony</option>
              <option value="deadline">Key Deadline</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
