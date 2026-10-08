import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db';
import {
  generateToken,
  requireAuth,
  optionalAuth,
  setAuthCookie,
  clearAuthCookie,
  AuthenticatedRequest,
} from './auth';
import { processAiQuery } from './ai';
import { MemberRole, TaskStatus } from '../src/types';

export const apiRouter = Router();

// ==========================================
// Health & Diagnostic
// ==========================================
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ==========================================
// Auth Routes
// ==========================================
apiRouter.post('/auth/register', (req, res) => {
  const { email, password, name, department, title } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser = db.createUser({
    email,
    name,
    password,
    department: department || 'Engineering',
    title: title || 'Collaborator',
  });

  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  setAuthCookie(res, token);
  res.status(201).json({ user: newUser, token });
});

apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { passwordHash: _, ...safeUser } = user;
  const token = generateToken({
    userId: safeUser.id,
    email: safeUser.email,
    role: safeUser.role,
  });

  setAuthCookie(res, token);
  res.json({ user: safeUser, token });
});

apiRouter.post('/auth/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.user });
});

// ==========================================
// Workspace Routes
// ==========================================
apiRouter.get('/workspaces', optionalAuth, (_req, res) => {
  const workspaces = db.getAllWorkspaces();
  res.json({ workspaces });
});

apiRouter.get('/workspaces/:id', optionalAuth, (req, res) => {
  const ws = db.getWorkspaceById(req.params.id);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  res.json({ workspace: ws });
});

apiRouter.post('/workspaces', requireAuth, (req, res) => {
  const created = db.createWorkspace(req.body);
  res.status(201).json({ workspace: created });
});

// ==========================================
// Project Routes
// ==========================================
apiRouter.get('/projects', optionalAuth, (req, res) => {
  const workspaceId = req.query.workspaceId as string | undefined;
  const projects = db.getProjects(workspaceId);
  res.json({ projects });
});

apiRouter.get('/projects/:id', optionalAuth, (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

apiRouter.post('/projects', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const creator = req.user || db.getAllUsers()[0];
  const newProject = db.createProject(req.body, creator);
  res.status(201).json({ project: newProject });
});

apiRouter.patch('/projects/:id', optionalAuth, (req, res) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found' });
  res.json({ project: updated });
});

apiRouter.delete('/projects/:id', optionalAuth, (req, res) => {
  const success = db.deleteProject(req.params.id);
  if (!success) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

// ==========================================
// Task Routes
// ==========================================
apiRouter.get('/tasks', optionalAuth, (req, res) => {
  const workspaceId = req.query.workspaceId as string | undefined;
  const projectId = req.query.projectId as string | undefined;
  const tasks = db.getTasks(workspaceId, projectId);
  res.json({ tasks });
});

apiRouter.get('/tasks/:id', optionalAuth, (req, res) => {
  const task = db.getTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task });
});

apiRouter.post('/tasks', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const creator = req.user || db.getAllUsers()[0];
  const created = db.createTask(req.body, creator);
  res.status(201).json({ task: created });
});

apiRouter.patch('/tasks/:id', optionalAuth, (req, res) => {
  const updated = db.updateTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json({ task: updated });
});

apiRouter.patch('/tasks/:id/status', optionalAuth, (req, res) => {
  const { status } = req.body as { status: TaskStatus };
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const updated = db.updateTask(req.params.id, { status });
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json({ task: updated });
});

apiRouter.delete('/tasks/:id', optionalAuth, (req, res) => {
  const success = db.deleteTask(req.params.id);
  if (!success) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
});

// ==========================================
// Document Routes
// ==========================================
apiRouter.get('/documents', optionalAuth, (req, res) => {
  const workspaceId = req.query.workspaceId as string | undefined;
  const documents = db.getDocuments(workspaceId);
  res.json({ documents });
});

apiRouter.get('/documents/:id', optionalAuth, (req, res) => {
  const doc = db.getDocumentById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json({ document: doc });
});

apiRouter.post('/documents', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const author = req.user || db.getAllUsers()[0];
  const created = db.createDocument(req.body, author);
  res.status(201).json({ document: created });
});

apiRouter.patch('/documents/:id', optionalAuth, (req, res) => {
  const updated = db.updateDocument(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Document not found' });
  res.json({ document: updated });
});

apiRouter.delete('/documents/:id', optionalAuth, (req, res) => {
  const success = db.deleteDocument(req.params.id);
  if (!success) return res.status(404).json({ error: 'Document not found' });
  res.json({ success: true });
});

// ==========================================
// Chat / Messages Routes
// ==========================================
apiRouter.get('/messages', optionalAuth, (_req, res) => {
  const allMessages = db.getAllMessages();
  res.json({ messages: allMessages });
});

apiRouter.get('/messages/:targetKey', optionalAuth, (req, res) => {
  const msgs = db.getMessages(req.params.targetKey);
  res.json({ messages: msgs });
});

apiRouter.post('/messages/:targetKey', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sender = req.user || db.getAllUsers()[0];
  const { text, attachment, channelId } = req.body;
  if (!text && !attachment) {
    return res.status(400).json({ error: 'Text or attachment is required' });
  }

  const created = db.createMessage(req.params.targetKey, { text, attachment, channelId }, sender);
  res.status(201).json({ message: created });
});

// ==========================================
// Member Management Routes
// ==========================================
apiRouter.get('/members', optionalAuth, (_req, res) => {
  const members = db.getAllUsers();
  res.json({ members });
});

apiRouter.post('/members/invite', optionalAuth, (req, res) => {
  const { email, role, department } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Member is already registered' });
  }

  const name = email.split('@')[0].replace('.', ' ');
  const newUser = db.createUser({
    email,
    name,
    password: 'password123',
    role: (role as MemberRole) || 'MEMBER',
    department: department || 'General',
  });

  res.status(201).json({ member: newUser });
});

apiRouter.patch('/members/:id/role', optionalAuth, (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'Role is required' });

  const updated = db.updateUser(req.params.id, { role });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ member: updated });
});

// ==========================================
// Notification Routes
// ==========================================
apiRouter.get('/notifications', optionalAuth, (_req, res) => {
  const items = db.getNotifications();
  res.json({ notifications: items });
});

apiRouter.patch('/notifications/:id/read', optionalAuth, (req, res) => {
  const item = db.markNotificationRead(req.params.id);
  if (!item) return res.status(404).json({ error: 'Notification not found' });
  res.json({ notification: item });
});

apiRouter.post('/notifications/read-all', optionalAuth, (_req, res) => {
  db.markAllNotificationsRead();
  res.json({ success: true });
});

// ==========================================
// AI Assistant Route
// ==========================================
apiRouter.post('/ai/chat', optionalAuth, async (req, res) => {
  const { message, workspaceName, projectName, context } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await processAiQuery({
      message,
      workspaceName,
      projectName,
      context,
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      error: 'AI query processing encountered an unexpected issue',
      details: err?.message,
    });
  }
});
