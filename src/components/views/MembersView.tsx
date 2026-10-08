import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { RoleTag } from '../ui/Badge';
import { MemberRole, User } from '../../types';

export const MembersView: React.FC = () => {
  const {
    members,
    inviteMember,
    updateMemberRole,
    openAiAssistant,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('MEMBER');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const filteredMembers = members.filter((m) => {
    const matchesQuery = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase()) || m.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    inviteMember(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* HEADER */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg p-4 md:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#18181B]">
              Team Directory & Role Permissions
            </h1>
            <p className="text-xs text-[#57534E] mt-0.5">
              Manage workspace access, team governance, and role allocations across projects.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={<Sparkles size={12} className="text-stone-700" />}
              onClick={() =>
                openAiAssistant({
                  title: 'Team Workload AI',
                  prompt: 'Analyze current team task distribution and highlight over-allocated members.',
                })
              }
            >
              Analyze Load
            </Button>
            <Button
              variant="primary"
              size="xs"
              icon={<UserPlus size={12} />}
              onClick={() => setIsInviteOpen(true)}
            >
              Invite Member
            </Button>
          </div>
        </div>

        {/* Control Strip */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-2 text-[#8A857D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, department..."
                className="pl-7 pr-2.5 py-1 bg-[#F6F5F2] border border-[#E2DFD7] rounded text-xs text-[#18181B] placeholder:text-[#8A857D] focus:outline-none focus:border-[#18181B] w-64"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2 py-1 bg-white border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            >
              <option value="all">All Roles ({members.length})</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          <div className="text-[11px] font-mono tabular-nums text-[#57534E]">
            Showing {filteredMembers.length} team members
          </div>
        </div>
      </div>

      {/* MEMBERS TABLE */}
      <div className="bg-white border border-[#E2DFD7] rounded-lg overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E2DFD7] bg-[#FAF9F7] text-[#57534E] font-semibold text-[11px]">
              <th className="py-2.5 px-4 font-medium">Member</th>
              <th className="py-2.5 px-4 font-medium">Role</th>
              <th className="py-2.5 px-4 font-medium">Department</th>
              <th className="py-2.5 px-4 font-medium">Status</th>
              <th className="py-2.5 px-4 font-medium">Timezone</th>
              <th className="py-2.5 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DFD7]">
            {filteredMembers.map((member) => (
              <tr
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="hover:bg-[#F6F5F2] cursor-pointer transition-colors group h-12"
              >
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E2DFD7]"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                          member.status === 'online'
                            ? 'bg-emerald-600'
                            : member.status === 'away'
                            ? 'bg-amber-500'
                            : 'bg-stone-300'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-[#18181B] group-hover:text-stone-700 transition-colors">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-[#57534E]">{member.email}</div>
                    </div>
                  </div>
                </td>

                <td className="py-2 px-4">
                  <RoleTag role={member.role} />
                </td>

                <td className="py-2 px-4 text-[#18181B] font-medium">{member.department}</td>

                <td className="py-2 px-4">
                  <span className="capitalize text-[#57534E] font-mono text-[11px]">
                    {member.status}
                  </span>
                </td>

                <td className="py-2 px-4 font-mono tabular-nums text-[#57534E]">
                  {member.timezone?.split(' ')[0] || 'UTC'}
                </td>

                <td className="py-2 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={member.role}
                    onChange={(e) => updateMemberRole(member.id, e.target.value as MemberRole)}
                    className="text-[11px] bg-[#F6F5F2] border border-[#E2DFD7] rounded px-1.5 py-0.5 text-[#18181B] focus:outline-none focus:border-[#18181B]"
                  >
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Member"
        description="Grant access to the current workspace and define role permissions."
        maxWidth="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleInviteSubmit} disabled={!inviteEmail.trim()}>
              Send Invite
            </Button>
          </>
        }
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#18181B] mb-1">Role Permission</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as MemberRole)}
              className="w-full px-2.5 py-1.5 border border-[#E2DFD7] rounded text-xs text-[#18181B] focus:outline-none focus:border-[#18181B] bg-white"
            >
              <option value="MEMBER">Member (Can edit tasks and participate in chat)</option>
              <option value="ADMIN">Admin (Can manage workspace settings and members)</option>
              <option value="VIEWER">Viewer (Read-only access to deliverables)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Member Details Inspector Modal */}
      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={selectedMember.name}
          description={`${selectedMember.title} · ${selectedMember.department}`}
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedMember(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-[#FAF9F7] rounded border border-[#E2DFD7]">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-1 ring-[#E2DFD7]"
              />
              <div>
                <div className="font-bold text-sm text-[#18181B]">{selectedMember.name}</div>
                <div className="text-[11px] text-[#57534E]">{selectedMember.email}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <RoleTag role={selectedMember.role} />
                  <span className="text-[10px] font-mono text-[#8A857D]">{selectedMember.timezone}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F6F5F2] rounded border border-[#E2DFD7] text-[11px] leading-relaxed text-[#57534E]">
              Active in 4 project streams including UI Projects, Mobile Roadmap, and AI Assistant Sprints.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
