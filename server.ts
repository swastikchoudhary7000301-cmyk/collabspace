import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { apiRouter } from './server/routes';
import { db } from './server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Socket.IO Setup
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    socket.on('join_room', (room: string) => {
      socket.join(room);
    });

    socket.on('leave_room', (room: string) => {
      socket.leave(room);
    });

    socket.on('send_message', (payload: { targetKey: string; text: string; attachment?: any; sender: any; channelId?: string }) => {
      try {
        const { targetKey, text, attachment, sender, channelId } = payload;
        const newMsg = db.createMessage(targetKey, { text, attachment, channelId }, sender);
        
        // Broadcast to specific room
        io.to(targetKey).emit('new_message', { targetKey, message: newMsg });
        // Also broadcast to all clients for real-time sidebar notification / unread count
        socket.broadcast.emit('message_dispatched', { targetKey, message: newMsg });
      } catch (err) {
        console.error('Socket send_message error:', err);
      }
    });

    socket.on('typing', (payload: { targetKey: string; user: any; isTyping: boolean }) => {
      socket.to(payload.targetKey).emit('user_typing', payload);
    });

    socket.on('task_changed', (payload: { task: any; action: 'created' | 'updated' | 'deleted' }) => {
      socket.broadcast.emit('task_sync', payload);
    });

    socket.on('project_changed', (payload: { project: any; action: 'created' | 'updated' | 'deleted' }) => {
      socket.broadcast.emit('project_sync', payload);
    });

    socket.on('doc_changed', (payload: { doc: any; action: 'created' | 'updated' | 'deleted' }) => {
      socket.broadcast.emit('doc_sync', payload);
    });
  });

  // REST API Routes
  app.use('/api', apiRouter);

  // Development vs Production serving
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`CollabSpace unified full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting CollabSpace server:', err);
  process.exit(1);
});
