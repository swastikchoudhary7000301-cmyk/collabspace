import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Workspace,
  Project,
  Task,
  DocumentItem,
  ChatMessage,
  NotificationItem,
} from '../src/types';
import {
  currentUser,
  mockUsers,
  mockWorkspaces,
  mockProjects,
  mockTasks,
  mockDocuments,
  mockChatMessages,
  mockNotifications,
} from '../src/mock/data';

export interface DBUser extends User {
  passwordHash: string;
}

export interface DatabaseSchema {
  users: DBUser[];
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  documents: DocumentItem[];
  messages: Record<string, ChatMessage[]>;
  notifications: NotificationItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'collabspace-db.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to load existing db file, re-seeding...', err);
    }

    // Default seed with bcrypt password 'password123'
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);
    const seededUsers: DBUser[] = mockUsers.map((u) => ({
      ...u,
      passwordHash: defaultPasswordHash,
    }));

    const initial: DatabaseSchema = {
      users: seededUsers,
      workspaces: mockWorkspaces,
      projects: mockProjects,
      tasks: mockTasks,
      documents: mockDocuments,
      messages: mockChatMessages,
      notifications: mockNotifications,
    };

    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db file:', err);
    }
  }

  private persist() {
    this.saveDirect(this.data);
  }

  // --- Users ---
  getAllUsers(): User[] {
    return this.data.users.map(({ passwordHash, ...safeUser }) => safeUser);
  }

  getUserById(id: string): DBUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Partial<DBUser> & { email: string; name: string; password: string }): User {
    const passwordHash = bcrypt.hashSync(userData.password, 10);
    const newUser: DBUser = {
      id: userData.id || `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      role: userData.role || 'MEMBER',
      title: userData.title || 'Collaborator',
      status: 'online',
      department: userData.department || 'Engineering',
      timezone: userData.timezone || 'UTC',
      passwordHash,
    };

    this.data.users.push(newUser);
    this.persist();

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
    };
    this.persist();

    const { passwordHash: _, ...safeUser } = this.data.users[index];
    return safeUser;
  }

  // --- Workspaces ---
  getAllWorkspaces(): Workspace[] {
    return this.data.workspaces;
  }

  getWorkspaceById(id: string): Workspace | undefined {
    return this.data.workspaces.find((w) => w.id === id);
  }

  createWorkspace(ws: Partial<Workspace>): Workspace {
    const newWs: Workspace = {
      id: ws.id || `ws_${Date.now()}`,
      name: ws.name || 'Untitled Workspace',
      slug: ws.slug || `ws-${Date.now()}`,
      description: ws.description || 'Modern collaboration space',
      icon: ws.icon || 'Layers',
      plan: ws.plan || 'Pro',
      memberCount: 1,
      projectCount: 0,
    };
    this.data.workspaces.push(newWs);
    this.persist();
    return newWs;
  }

  // --- Projects ---
  getProjects(workspaceId?: string): Project[] {
    if (!workspaceId) return this.data.projects;
    return this.data.projects.filter((p) => p.workspaceId === workspaceId);
  }

  getProjectById(id: string): Project | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  createProject(projectData: Partial<Project>, creator: User): Project {
    const newProject: Project = {
      id: projectData.id || `proj_${Date.now()}`,
      workspaceId: projectData.workspaceId || 'ws_1',
      name: projectData.name || 'Untitled Project',
      description: projectData.description || 'Project plan and deliverables',
      status: projectData.status || 'planning',
      startDate: projectData.startDate || 'Oct 08, 2026',
      endDate: projectData.endDate || 'Nov 30, 2026',
      progress: projectData.progress ?? 0,
      lead: projectData.lead || creator,
      members: projectData.members || [creator],
      color: projectData.color || '#18181B',
      sprints: projectData.sprints || [
        {
          id: `sp_${Date.now()}`,
          name: 'Sprint 1',
          taskCount: 0,
          startDate: 'Oct 08, 2026',
          endDate: 'Oct 22, 2026',
        },
      ],
    };

    this.data.projects.unshift(newProject);
    this.persist();
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.data.projects[index] = {
      ...this.data.projects[index],
      ...updates,
    };
    this.persist();
    return this.data.projects[index];
  }

  deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    this.data.tasks = this.data.tasks.filter((t) => t.projectId !== id);
    this.persist();
    return this.data.projects.length < initialLen;
  }

  // --- Tasks ---
  getTasks(workspaceId?: string, projectId?: string): Task[] {
    let result = this.data.tasks;
    if (workspaceId) result = result.filter((t) => t.workspaceId === workspaceId);
    if (projectId) result = result.filter((t) => t.projectId === projectId);
    return result;
  }

  getTaskById(id: string): Task | undefined {
    return this.data.tasks.find((t) => t.id === id);
  }

  createTask(taskData: Partial<Task>, creator: User): Task {
    const project = this.getProjectById(taskData.projectId || '') || this.data.projects[0];
    const newTask: Task = {
      id: taskData.id || `tsk_${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      workspaceId: taskData.workspaceId || project.workspaceId || 'ws_1',
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || creator,
      dueDate: taskData.dueDate || 'Oct 20, 2026',
      subtasks: taskData.subtasks || [],
      tags: taskData.tags || ['Task'],
      commentsCount: 0,
      createdAt: 'Today',
    };

    this.data.tasks.unshift(newTask);
    this.persist();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.data.tasks[index] = {
      ...this.data.tasks[index],
      ...updates,
    };
    this.persist();
    return this.data.tasks[index];
  }

  deleteTask(id: string): boolean {
    const initialLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter((t) => t.id !== id);
    this.persist();
    return this.data.tasks.length < initialLen;
  }

  // --- Documents ---
  getDocuments(workspaceId?: string): DocumentItem[] {
    if (!workspaceId) return this.data.documents;
    return this.data.documents.filter((d) => d.workspaceId === workspaceId);
  }

  getDocumentById(id: string): DocumentItem | undefined {
    return this.data.documents.find((d) => d.id === id);
  }

  createDocument(docData: Partial<DocumentItem>, author: User): DocumentItem {
    const newDoc: DocumentItem = {
      id: docData.id || `doc_${Date.now()}`,
      workspaceId: docData.workspaceId || 'ws_1',
      projectId: docData.projectId,
      title: docData.title || 'Untitled Document',
      description: docData.description || 'Document draft in CollabSpace',
      category: docData.category || 'Specification',
      author: docData.author || author,
      updatedAt: 'Just now',
      fileSize: docData.fileSize || '120 KB',
      content: docData.content || `# ${docData.title || 'Untitled Document'}\n\nStart typing documentation...`,
      tags: docData.tags || ['Docs'],
      isPinned: docData.isPinned ?? false,
    };

    this.data.documents.unshift(newDoc);
    this.persist();
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<DocumentItem>): DocumentItem | null {
    const index = this.data.documents.findIndex((d) => d.id === id);
    if (index === -1) return null;

    this.data.documents[index] = {
      ...this.data.documents[index],
      ...updates,
      updatedAt: 'Just now',
    };
    this.persist();
    return this.data.documents[index];
  }

  deleteDocument(id: string): boolean {
    const initialLen = this.data.documents.length;
    this.data.documents = this.data.documents.filter((d) => d.id !== id);
    this.persist();
    return this.data.documents.length < initialLen;
  }

  // --- Messages & Chat ---
  getMessages(targetKey: string): ChatMessage[] {
    return this.data.messages[targetKey] || [];
  }

  getAllMessages(): Record<string, ChatMessage[]> {
    return this.data.messages;
  }

  createMessage(targetKey: string, messageData: Partial<ChatMessage>, sender: User): ChatMessage {
    const newMsg: ChatMessage = {
      id: messageData.id || `msg_${Date.now()}`,
      channelId: messageData.channelId,
      senderId: sender.id,
      sender,
      text: (messageData.text || '').trim(),
      timestamp: 'Just now',
      reactions: messageData.reactions || [],
      attachment: messageData.attachment,
      repliesCount: 0,
    };

    if (!this.data.messages[targetKey]) {
      this.data.messages[targetKey] = [];
    }
    this.data.messages[targetKey].push(newMsg);
    this.persist();
    return newMsg;
  }

  // --- Notifications ---
  getNotifications(): NotificationItem[] {
    return this.data.notifications;
  }

  markNotificationRead(id: string): NotificationItem | null {
    const item = this.data.notifications.find((n) => n.id === id);
    if (!item) return null;
    item.read = true;
    this.persist();
    return item;
  }

  markAllNotificationsRead(): void {
    this.data.notifications.forEach((n) => (n.read = true));
    this.persist();
  }

  createNotification(notif: Partial<NotificationItem>, actor: User): NotificationItem {
    const item: NotificationItem = {
      id: notif.id || `notif_${Date.now()}`,
      type: notif.type || 'task_assigned',
      title: notif.title || 'New activity',
      description: notif.description || '',
      time: 'Just now',
      read: false,
      actor,
      linkRoute: notif.linkRoute,
    };
    this.data.notifications.unshift(item);
    this.persist();
    return item;
  }
}

export const db = new DatabaseStore();
