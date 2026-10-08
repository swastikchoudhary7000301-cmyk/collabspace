export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export type MemberStatus = 'online' | 'away' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: MemberRole;
  title: string;
  status: MemberStatus;
  department: string;
  phone?: string;
  timezone?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  memberCount: number;
  projectCount: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  startDate: string;
  endDate: string;
  progress: number;
  members: User[];
  lead: User;
  color: string;
  sprints?: { id: string; name: string; taskCount: number; startDate: string; endDate: string }[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  projectName?: string;
  workspaceId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: User;
  dueDate: string;
  subtasks: Subtask[];
  tags: string[];
  commentsCount: number;
  attachmentsCount?: number;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: 'task' | 'meeting' | 'review' | 'deadline' | 'sprint';
  priority?: Priority;
  assignedUsers: User[];
  color: string;
  description?: string;
}

export interface DocumentItem {
  id: string;
  workspaceId: string;
  projectId?: string;
  title: string;
  description: string;
  category: 'PRD' | 'Specification' | 'Design' | 'Meeting Notes' | 'Guidelines' | 'Research';
  author: User;
  updatedAt: string;
  fileSize: string;
  content: string;
  tags: string[];
  isPinned?: boolean;
}

export interface ChatMessage {
  id: string;
  channelId?: string;
  senderId: string;
  sender: User;
  text: string;
  timestamp: string;
  reactions: { emoji: string; count: number; users: string[] }[];
  attachment?: {
    name: string;
    size: string;
    type: 'pdf' | 'figma' | 'image' | 'code' | 'doc';
  };
  repliesCount?: number;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  unreadCount: number;
  membersCount: number;
}

export interface DirectMessageConversation {
  id: string;
  user: User;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'message' | 'document_shared' | 'member_joined' | 'project_update';
  title: string;
  description: string;
  time: string;
  read: boolean;
  actor: User;
  linkText?: string;
  linkRoute?: string;
}

export type AppRoute =
  | '/'
  | '/login'
  | '/register'
  | '/dashboard'
  | '/workspaces'
  | `/workspaces/${string}`
  | `/workspaces/${string}/projects`
  | `/workspaces/${string}/projects/${string}`
  | `/workspaces/${string}/tasks`
  | `/workspaces/${string}/calendar`
  | `/workspaces/${string}/documents`
  | `/workspaces/${string}/chat`
  | `/workspaces/${string}/members`
  | '/notifications'
  | '/settings'
  | '/profile';
