import { io, Socket } from 'socket.io-client';
import { ChatMessage, User } from '../types';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance && typeof window !== 'undefined') {
    socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      // connected successfully
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('Real-time connection fallback to polling:', err.message);
    });
  }

  return socketInstance!;
}

export const realTimeClient = {
  joinRoom(room: string) {
    const s = getSocket();
    if (s && s.connected) {
      s.emit('join_room', room);
    }
  },

  leaveRoom(room: string) {
    const s = getSocket();
    if (s && s.connected) {
      s.emit('leave_room', room);
    }
  },

  sendMessage(payload: { targetKey: string; text: string; attachment?: any; sender: User; channelId?: string }) {
    const s = getSocket();
    if (s && s.connected) {
      s.emit('send_message', payload);
    }
  },

  sendTyping(payload: { targetKey: string; user: User; isTyping: boolean }) {
    const s = getSocket();
    if (s && s.connected) {
      s.emit('typing', payload);
    }
  },

  notifyTaskChanged(task: any, action: 'created' | 'updated' | 'deleted') {
    const s = getSocket();
    if (s && s.connected) {
      s.emit('task_changed', { task, action });
    }
  },

  onNewMessage(handler: (data: { targetKey: string; message: ChatMessage }) => void) {
    const s = getSocket();
    if (s) {
      s.on('new_message', handler);
      s.on('message_dispatched', handler);
    }
    return () => {
      if (s) {
        s.off('new_message', handler);
        s.off('message_dispatched', handler);
      }
    };
  },

  onUserTyping(handler: (data: { targetKey: string; user: User; isTyping: boolean }) => void) {
    const s = getSocket();
    if (s) {
      s.on('user_typing', handler);
    }
    return () => {
      if (s) {
        s.off('user_typing', handler);
      }
    };
  },

  onTaskSync(handler: (data: { task: any; action: 'created' | 'updated' | 'deleted' }) => void) {
    const s = getSocket();
    if (s) {
      s.on('task_sync', handler);
    }
    return () => {
      if (s) {
        s.off('task_sync', handler);
      }
    };
  },
};
