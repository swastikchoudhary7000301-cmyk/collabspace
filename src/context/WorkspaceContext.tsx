import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Workspace,
  Project,
  Task,
  TaskStatus,
  DocumentItem,
  ChatMessage,
  NotificationItem,
  User,
  MemberRole,
} from '../types';
import {
  currentUser as initialCurrentUser,
  mockUsers,
  mockWorkspaces,
  mockProjects,
  mockTasks,
  mockDocuments,
  mockChatMessages,
  mockNotifications,
} from '../mock/data';
import { api } from '../lib/api';
import { realTimeClient } from '../lib/socket';

interface AiContextData {
  title?: string;
  type?: string;
  prompt?: string;
}

interface WorkspaceContextType {
  // Authentication & Current User
  currentUser: User;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; department?: string }) => Promise<void>;
  logout: () => Promise<void>;

  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;

  // Workspace
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  switchWorkspace: (workspaceId: string) => void;

  // Projects
  projects: Project[];
  currentProjectId: string;
  setCurrentProjectId: (id: string) => void;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Tasks
  tasks: Task[];
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  selectedTaskDetail: Task | null;
  setSelectedTaskDetail: (task: Task | null) => void;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Partial<DocumentItem>) => Promise<void>;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  activeDocument: DocumentItem | null;
  setActiveDocument: (doc: DocumentItem | null) => void;

  // Chat & Real-Time
  activeChannelId: string;
  activeDmId: string | null;
  messages: Record<string, ChatMessage[]>;
  setActiveChannel: (channelId: string) => void;
  setActiveDm: (dmId: string) => void;
  sendMessage: (text: string, attachment?: any) => Promise<void>;

  // Members
  members: User[];
  inviteMember: (email: string, role: MemberRole) => Promise<void>;
  updateMemberRole: (userId: string, role: MemberRole) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  // Modals & UI Controls
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiContext: AiContextData | null;
  openAiAssistant: (context?: AiContextData) => void;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;
  isNewDocModalOpen: boolean;
  setIsNewDocModalOpen: (open: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Global search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  activeToast: string | null;
  showToast: (message: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/') {
      return window.location.pathname;
    }
    return '/';
  });

  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(mockWorkspaces[0]);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string>(mockProjects[0].id);

  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(null);

  const [activeChannelId, setActiveChannelId] = useState<string>('chn_product');
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(mockChatMessages);

  const [members, setMembers] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiContext, setAiContext] = useState<AiContextData | null>(null);

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast((curr) => (curr === message ? null : curr));
    }, 3200);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
    }
    setMobileSidebarOpen(false);
  };

  // Sync back/forward browser buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K for search command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize data from real REST API
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch current user if token present
        if (api.getToken()) {
          try {
            const meRes = await api.getMe();
            if (meRes.user) {
              setCurrentUser(meRes.user);
            }
          } catch {
            // Token expired or invalid
            api.setToken(null);
          }
        }

        // Fetch workspaces
        const wsRes = await api.getWorkspaces().catch(() => null);
        if (wsRes?.workspaces?.length) {
          setWorkspaces(wsRes.workspaces);
          setCurrentWorkspace(wsRes.workspaces[0]);
        }

        // Fetch projects
        const projRes = await api.getProjects().catch(() => null);
        if (projRes?.projects?.length) {
          setProjects(projRes.projects);
          setCurrentProjectId(projRes.projects[0].id);
        }

        // Fetch tasks
        const tskRes = await api.getTasks().catch(() => null);
        if (tskRes?.tasks?.length) {
          setTasks(tskRes.tasks);
        }

        // Fetch documents
        const docRes = await api.getDocuments().catch(() => null);
        if (docRes?.documents?.length) {
          setDocuments(docRes.documents);
        }

        // Fetch messages
        const msgRes = await api.getAllMessages().catch(() => null);
        if (msgRes?.messages) {
          setMessages(msgRes.messages);
        }

        // Fetch members
        const memRes = await api.getMembers().catch(() => null);
        if (memRes?.members?.length) {
          setMembers(memRes.members);
        }

        // Fetch notifications
        const notifRes = await api.getNotifications().catch(() => null);
        if (notifRes?.notifications) {
          setNotifications(notifRes.notifications);
        }
      } catch (err) {
        console.warn('Initial REST data load had minor error, using cached defaults:', err);
      }
    }

    loadInitialData();
  }, []);

  // Real-time Socket.IO Listeners
  useEffect(() => {
    // Join active channel/DM rooms
    const activeKey = activeDmId || activeChannelId;
    if (activeKey) {
      realTimeClient.joinRoom(activeKey);
    }

    const unsubMsg = realTimeClient.onNewMessage(({ targetKey, message }) => {
      setMessages((prev) => {
        const existing = prev[targetKey] || [];
        if (existing.some((m) => m.id === message.id)) return prev;
        return {
          ...prev,
          [targetKey]: [...existing, message],
        };
      });
    });

    const unsubTask = realTimeClient.onTaskSync(({ task, action }) => {
      setTasks((prev) => {
        if (action === 'created') {
          if (prev.some((t) => t.id === task.id)) return prev;
          return [task, ...prev];
        }
        if (action === 'updated') {
          return prev.map((t) => (t.id === task.id ? { ...t, ...task } : t));
        }
        if (action === 'deleted') {
          return prev.filter((t) => t.id !== task.id);
        }
        return prev;
      });
    });

    return () => {
      if (activeKey) {
        realTimeClient.leaveRoom(activeKey);
      }
      unsubMsg();
      unsubTask();
    };
  }, [activeChannelId, activeDmId]);

  // Auth methods
  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setCurrentUser(res.user);
    showToast(`Welcome back, ${res.user.name}`);
  };

  const register = async (data: { email: string; password: string; name: string; department?: string }) => {
    const res = await api.register(data);
    setCurrentUser(res.user);
    showToast(`Account created for ${res.user.name}`);
  };

  const logout = async () => {
    await api.logout();
    api.setToken(null);
    showToast('Signed out successfully');
    navigate('/login');
  };

  const switchWorkspace = (workspaceId: string) => {
    const found = workspaces.find((w) => w.id === workspaceId);
    if (found) {
      setCurrentWorkspace(found);
      showToast(`Switched to workspace: ${found.name}`);
    }
  };

  const addProject = async (projectData: Partial<Project>) => {
    const fallbackId = `proj_${Date.now()}`;
    const optimistic: Project = {
      id: fallbackId,
      workspaceId: currentWorkspace.id,
      name: projectData.name || 'Untitled Project',
      description: projectData.description || 'Project initiated in CollabSpace',
      status: projectData.status || 'planning',
      startDate: projectData.startDate || 'Oct 08, 2026',
      endDate: projectData.endDate || 'Nov 30, 2026',
      progress: 0,
      lead: currentUser,
      members: [currentUser],
      color: projectData.color || '#18181B',
      sprints: [{ id: `sp_${Date.now()}`, name: 'Sprint 1', taskCount: 0, startDate: 'Oct 08, 2026', endDate: 'Oct 22, 2026' }],
    };

    setProjects((prev) => [optimistic, ...prev]);
    setCurrentProjectId(optimistic.id);
    showToast(`Project created: ${optimistic.name}`);
    setIsNewProjectModalOpen(false);

    try {
      const res = await api.createProject({
        ...projectData,
        workspaceId: currentWorkspace.id,
      });
      if (res.project) {
        setProjects((prev) => prev.map((p) => (p.id === fallbackId ? res.project : p)));
        setCurrentProjectId(res.project.id);
      }
    } catch (err: any) {
      console.warn('Project creation REST fallback:', err.message);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await api.updateProject(id, updates);
    } catch (err: any) {
      console.warn('Project update REST sync error:', err.message);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    showToast('Project removed');
    try {
      await api.deleteProject(id);
    } catch (err: any) {
      console.warn('Project delete REST sync error:', err.message);
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    const activeProject = projects.find((p) => p.id === (taskData.projectId || currentProjectId)) || projects[0];
    const fallbackId = `tsk_${Date.now()}`;
    const newTask: Task = {
      id: fallbackId,
      projectId: activeProject.id,
      projectName: activeProject.name,
      workspaceId: currentWorkspace.id,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || currentUser,
      dueDate: taskData.dueDate || 'Oct 20, 2026',
      subtasks: taskData.subtasks || [],
      tags: taskData.tags || ['Task'],
      commentsCount: 0,
      createdAt: 'Today',
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task added to ${activeProject.name}`);
    setIsNewTaskModalOpen(false);

    realTimeClient.notifyTaskChanged(newTask, 'created');

    try {
      const res = await api.createTask({
        ...taskData,
        projectId: activeProject.id,
        workspaceId: currentWorkspace.id,
      });
      if (res.task) {
        setTasks((prev) => prev.map((t) => (t.id === fallbackId ? res.task : t)));
      }
    } catch (err: any) {
      console.warn('Task create REST sync:', err.message);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      showToast(`Moved to ${status.replace('_', ' ').toUpperCase()}`);
      realTimeClient.notifyTaskChanged({ ...target, status }, 'updated');
    }

    try {
      await api.updateTaskStatus(taskId, status);
    } catch (err: any) {
      console.warn('Task status update REST sync:', err.message);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
      setSelectedTaskDetail((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Task updated');

    const updatedTask = tasks.find((t) => t.id === taskId);
    if (updatedTask) {
      realTimeClient.notifyTaskChanged({ ...updatedTask, ...updates }, 'updated');
    }

    try {
      await api.updateTask(taskId, updates);
    } catch (err: any) {
      console.warn('Task update REST sync:', err.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskDetail?.id === taskId) {
      setSelectedTaskDetail(null);
    }
    showToast('Task removed');

    realTimeClient.notifyTaskChanged({ id: taskId }, 'deleted');

    try {
      await api.deleteTask(taskId);
    } catch (err: any) {
      console.warn('Task delete REST sync:', err.message);
    }
  };

  const addDocument = async (docData: Partial<DocumentItem>) => {
    const fallbackId = `doc_${Date.now()}`;
    const newDoc: DocumentItem = {
      id: fallbackId,
      workspaceId: currentWorkspace.id,
      title: docData.title || 'Untitled Document',
      description: docData.description || 'Document draft in CollabSpace',
      category: docData.category || 'Specification',
      author: currentUser,
      updatedAt: 'Just now',
      fileSize: '120 KB',
      content: docData.content || `# ${docData.title || 'Untitled Document'}\n\nStart typing documentation...`,
      tags: docData.tags || ['Docs'],
      isPinned: docData.isPinned ?? false,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocument(newDoc);
    showToast(`Document created: ${newDoc.title}`);
    setIsNewDocModalOpen(false);

    try {
      const res = await api.createDocument({
        ...docData,
        workspaceId: currentWorkspace.id,
      });
      if (res.document) {
        setDocuments((prev) => prev.map((d) => (d.id === fallbackId ? res.document : d)));
        setActiveDocument(res.document);
      }
    } catch (err: any) {
      console.warn('Document create REST sync:', err.message);
    }
  };

  const updateDocument = async (id: string, updates: Partial<DocumentItem>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: 'Just now' } : d)));
    if (activeDocument?.id === id) {
      setActiveDocument((prev) => (prev ? { ...prev, ...updates, updatedAt: 'Just now' } : null));
    }
    showToast('Document saved');
    try {
      await api.updateDocument(id, updates);
    } catch (err: any) {
      console.warn('Document update REST sync:', err.message);
    }
  };

  const deleteDocument = async (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (activeDocument?.id === id) {
      setActiveDocument(null);
    }
    showToast('Document removed');
    try {
      await api.deleteDocument(id);
    } catch (err: any) {
      console.warn('Document delete REST sync:', err.message);
    }
  };

  const setActiveChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveDmId(null);
  };

  const setActiveDm = (dmId: string) => {
    setActiveDmId(dmId);
    setActiveChannelId('');
  };

  const sendMessage = async (text: string, attachment?: any) => {
    if (!text.trim() && !attachment) return;
    const targetKey = activeDmId || activeChannelId;
    if (!targetKey) return;

    const optimisticMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId: activeDmId ? undefined : activeChannelId,
      senderId: currentUser.id,
      sender: currentUser,
      text: text.trim(),
      timestamp: 'Just now',
      reactions: [],
      attachment,
    };

    // Optimistic UI update
    setMessages((prev) => ({
      ...prev,
      [targetKey]: [...(prev[targetKey] || []), optimisticMsg],
    }));

    // Broadcast over real-time socket
    realTimeClient.sendMessage({
      targetKey,
      text: text.trim(),
      attachment,
      sender: currentUser,
      channelId: activeDmId ? undefined : activeChannelId,
    });

    // Persist via REST API
    try {
      await api.sendMessage(targetKey, text, attachment, activeDmId ? undefined : activeChannelId);
    } catch (err: any) {
      console.warn('Message send REST persistence:', err.message);
    }
  };

  const inviteMember = async (email: string, role: MemberRole) => {
    const fallbackId = `usr_${Date.now()}`;
    const newUser: User = {
      id: fallbackId,
      name: email.split('@')[0].replace('.', ' '),
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
      role,
      title: 'Collaborator',
      status: 'offline',
      department: 'General',
      timezone: 'UTC',
    };

    setMembers((prev) => [...prev, newUser]);
    showToast(`Invitation sent to ${email}`);

    try {
      const res = await api.inviteMember(email, role);
      if (res.member) {
        setMembers((prev) => prev.map((m) => (m.id === fallbackId ? res.member : m)));
      }
    } catch (err: any) {
      console.warn('Invite member REST sync:', err.message);
    }
  };

  const updateMemberRole = async (userId: string, role: MemberRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === userId ? { ...m, role } : m))
    );
    showToast('Member role updated');

    try {
      await api.updateMemberRole(userId, role);
    } catch (err: any) {
      console.warn('Update role REST sync:', err.message);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.markNotificationRead(id);
    } catch (err: any) {
      console.warn('Mark notification read REST sync:', err.message);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
    try {
      await api.markAllNotificationsRead();
    } catch (err: any) {
      console.warn('Mark all read REST sync:', err.message);
    }
  };

  const openAiAssistant = (context?: AiContextData) => {
    setAiContext(context || null);
    setIsAiModalOpen(true);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <WorkspaceContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        currentRoute,
        navigate,
        workspaces,
        currentWorkspace,
        switchWorkspace,
        projects,
        currentProjectId,
        setCurrentProjectId,
        addProject,
        updateProject,
        deleteProject,
        tasks,
        addTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        selectedTaskDetail,
        setSelectedTaskDetail,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        activeDocument,
        setActiveDocument,
        activeChannelId,
        activeDmId,
        messages,
        setActiveChannel,
        setActiveDm,
        sendMessage,
        members,
        inviteMember,
        updateMemberRole,
        notifications,
        unreadNotificationCount,
        markAsRead,
        markAllAsRead,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        aiContext,
        openAiAssistant,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isNewDocModalOpen,
        setIsNewDocModalOpen,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        searchQuery,
        setSearchQuery,
        activeToast,
        showToast,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
