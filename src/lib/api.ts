import {
  User,
  Workspace,
  Project,
  Task,
  TaskStatus,
  DocumentItem,
  ChatMessage,
  NotificationItem,
  MemberRole,
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('collabspace_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('collabspace_auth_token', token);
      } else {
        localStorage.removeItem('collabspace_auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMsg = errorBody.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async register(data: { email: string; password: string; name: string; department?: string; title?: string }): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' }).catch(() => {});
    this.setToken(null);
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  // Workspaces
  async getWorkspaces(): Promise<{ workspaces: Workspace[] }> {
    return this.request<{ workspaces: Workspace[] }>('/workspaces');
  }

  async getWorkspace(id: string): Promise<{ workspace: Workspace }> {
    return this.request<{ workspace: Workspace }>(`/workspaces/${id}`);
  }

  async createWorkspace(data: Partial<Workspace>): Promise<{ workspace: Workspace }> {
    return this.request<{ workspace: Workspace }>('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Projects
  async getProjects(workspaceId?: string): Promise<{ projects: Project[] }> {
    const q = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return this.request<{ projects: Project[] }>(`/projects${q}`);
  }

  async getProject(id: string): Promise<{ project: Project }> {
    return this.request<{ project: Project }>(`/projects/${id}`);
  }

  async createProject(data: Partial<Project>): Promise<{ project: Project }> {
    return this.request<{ project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<{ project: Project }> {
    return this.request<{ project: Project }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async getTasks(workspaceId?: string, projectId?: string): Promise<{ tasks: Task[] }> {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (projectId) params.append('projectId', projectId);
    const q = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ tasks: Task[] }>(`/tasks${q}`);
  }

  async createTask(data: Partial<Task>): Promise<{ task: Task }> {
    return this.request<{ task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<{ task: Task }> {
    return this.request<{ task: Task }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<{ task: Task }> {
    return this.request<{ task: Task }>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteTask(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Documents
  async getDocuments(workspaceId?: string): Promise<{ documents: DocumentItem[] }> {
    const q = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return this.request<{ documents: DocumentItem[] }>(`/documents${q}`);
  }

  async createDocument(data: Partial<DocumentItem>): Promise<{ document: DocumentItem }> {
    return this.request<{ document: DocumentItem }>('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDocument(id: string, updates: Partial<DocumentItem>): Promise<{ document: DocumentItem }> {
    return this.request<{ document: DocumentItem }>(`/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getAllMessages(): Promise<{ messages: Record<string, ChatMessage[]> }> {
    return this.request<{ messages: Record<string, ChatMessage[]> }>('/messages');
  }

  async getMessages(targetKey: string): Promise<{ messages: ChatMessage[] }> {
    return this.request<{ messages: ChatMessage[] }>(`/messages/${encodeURIComponent(targetKey)}`);
  }

  async sendMessage(targetKey: string, text: string, attachment?: any, channelId?: string): Promise<{ message: ChatMessage }> {
    return this.request<{ message: ChatMessage }>(`/messages/${encodeURIComponent(targetKey)}`, {
      method: 'POST',
      body: JSON.stringify({ text, attachment, channelId }),
    });
  }

  // Members
  async getMembers(): Promise<{ members: User[] }> {
    return this.request<{ members: User[] }>('/members');
  }

  async inviteMember(email: string, role: MemberRole, department?: string): Promise<{ member: User }> {
    return this.request<{ member: User }>('/members/invite', {
      method: 'POST',
      body: JSON.stringify({ email, role, department }),
    });
  }

  async updateMemberRole(id: string, role: MemberRole): Promise<{ member: User }> {
    return this.request<{ member: User }>(`/members/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    return this.request<{ notifications: NotificationItem[] }>('/notifications');
  }

  async markNotificationRead(id: string): Promise<{ notification: NotificationItem }> {
    return this.request<{ notification: NotificationItem }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    });
  }

  // AI Assistant
  async sendAiChat(message: string, workspaceName?: string, projectName?: string, context?: any): Promise<{
    text: string;
    generatedTasks?: { title: string; priority: 'low' | 'medium' | 'high' | 'urgent'; dueDate: string }[];
  }> {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, workspaceName, projectName, context }),
    });
  }
}

export const api = new ApiClient();
