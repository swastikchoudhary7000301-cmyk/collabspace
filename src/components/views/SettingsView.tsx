import React, { useState } from 'react';
import {
  User,
  Sliders,
  Bell,
  Shield,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { currentUser } from '../../mock/data';

export const SettingsView: React.FC = () => {
  const { currentWorkspace, showToast } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'security' | 'workspace'>('profile');

  // Form states
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [title, setTitle] = useState(currentUser.title);
  const [department, setDepartment] = useState(currentUser.department);

  const [emailDigest, setEmailDigest] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [mentionAlerts, setMentionAlerts] = useState(true);

  const [compactDensity, setCompactDensity] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings updated successfully');
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">Settings & Preferences</h1>
          <p className="text-xs text-[#57534E] mt-0.5">
            Personal workstation config, team notification preferences, and workspace security.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'profile', label: 'Profile', icon: <User size={12} /> },
            { id: 'appearance', label: 'Appearance', icon: <Sliders size={12} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={12} /> },
            { id: 'security', label: 'Security', icon: <Shield size={12} /> },
            { id: 'workspace', label: 'Workspace', icon: <Briefcase size={12} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#18181B] text-white font-bold'
                  : 'bg-[#F6F5F2] text-[#57534E] hover:text-[#18181B] border border-[#E2DFD7]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4 text-xs max-w-lg">
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#E2DFD7]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover ring-1 ring-[#E2DFD7]"
              />
              <div>
                <h3 className="font-bold text-[#18181B] text-sm">{name}</h3>
                <p className="text-[#57534E]">{email}</p>
                <button
                  type="button"
                  onClick={() => showToast('Avatar upload simulated')}
                  className="mt-1 text-[11px] font-semibold text-[#18181B] hover:underline cursor-pointer"
                >
                  Change Profile Photo
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                />
              </div>
            </div>

            <Button variant="primary" size="xs" type="submit">
              Save Changes
            </Button>
          </form>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-4 text-xs max-w-lg">
            <div>
              <h3 className="font-bold text-[#18181B] text-sm mb-1">Color Palette & Surface</h3>
              <p className="text-[#57534E] mb-3 leading-relaxed">
                CollabSpace defaults to a warm neutral foundation (#F6F5F2) with deep charcoal typography (#18181B) and hairline dividers.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded border-2 border-[#18181B] bg-[#F6F5F2] cursor-pointer shadow-2xs">
                  <div className="font-semibold text-[#18181B]">Warm Foundation (Active)</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">Calm, editorial, productivity-focused</div>
                </div>
                <div
                  onClick={() => showToast('Dark mode scheduled for next release')}
                  className="p-3 rounded border border-[#E2DFD7] opacity-60 cursor-pointer"
                >
                  <div className="font-semibold text-[#18181B]">Dark Canvas (Preview)</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">Low-light developer mode</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2DFD7]">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-[#18181B]">High-Density Mode</div>
                  <div className="text-[#57534E] text-[11px]">Tightens table row height to 36px</div>
                </div>
                <input
                  type="checkbox"
                  checked={compactDensity}
                  onChange={(e) => setCompactDensity(e.target.checked)}
                  className="rounded text-[#18181B] focus:ring-stone-500 w-3.5 h-3.5"
                />
              </label>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 text-xs max-w-lg">
            <h3 className="font-bold text-[#18181B] text-sm mb-1">Alert Preferences</h3>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded border border-[#E2DFD7] hover:bg-[#F6F5F2]">
                <div>
                  <div className="font-semibold text-[#18181B]">Direct Mentions & Thread Replies</div>
                  <div className="text-[#57534E] text-[11px]">Notify me when referenced in #product-dev or deliverables</div>
                </div>
                <input
                  type="checkbox"
                  checked={mentionAlerts}
                  onChange={(e) => setMentionAlerts(e.target.checked)}
                  className="rounded text-[#18181B] focus:ring-stone-500 w-3.5 h-3.5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded border border-[#E2DFD7] hover:bg-[#F6F5F2]">
                <div>
                  <div className="font-semibold text-[#18181B]">Deliverable Assignment Alerts</div>
                  <div className="text-[#57534E] text-[11px]">Notify me immediately when tasks are assigned to me</div>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded text-[#18181B] focus:ring-stone-500 w-3.5 h-3.5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded border border-[#E2DFD7] hover:bg-[#F6F5F2]">
                <div>
                  <div className="font-semibold text-[#18181B]">Weekly Executive Digest</div>
                  <div className="text-[#57534E] text-[11px]">Weekly report of sprint velocity and milestone progress</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="rounded text-[#18181B] focus:ring-stone-500 w-3.5 h-3.5"
                />
              </label>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs max-w-lg">
            <h3 className="font-bold text-[#18181B] text-sm">Authentication & Security</h3>
            <div className="p-3 rounded bg-[#FAF9F7] border border-[#E2DFD7] flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#18181B]">Two-Factor Authentication (2FA)</div>
                <div className="text-[#57534E] text-[11px]">Hardware security token or TOTP app</div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="font-semibold text-[#18181B]">Active Workstations</div>
              <div className="p-2.5 rounded border border-[#E2DFD7] text-[11px] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#18181B]">MacBook Pro (Chrome 129 · San Francisco, US)</div>
                  <div className="text-[#57534E] font-mono text-[10px]">Current workstation · Verified TLS 1.3</div>
                </div>
                <span className="text-emerald-700 font-bold text-[10px]">Current Session</span>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Tab */}
        {activeTab === 'workspace' && (
          <div className="space-y-4 text-xs max-w-lg">
            <h3 className="font-bold text-[#18181B] text-sm">Workspace Administration</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Workspace Name</label>
                <input
                  type="text"
                  defaultValue={currentWorkspace.name}
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#18181B] mb-1">Slug URL</label>
                <input
                  type="text"
                  defaultValue={currentWorkspace.slug}
                  className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] font-mono focus:outline-none focus:border-[#18181B]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-rose-100">
              <div className="p-3 rounded bg-rose-50/70 border border-rose-200 text-rose-800 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle size={13} />
                  <span>Danger Zone</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  Deleting a workspace removes all projects, documents, channels, and team permissions.
                </p>
                <button
                  type="button"
                  onClick={() => showToast('Action blocked in demo sandbox')}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[10px] cursor-pointer"
                >
                  Delete Workspace
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
