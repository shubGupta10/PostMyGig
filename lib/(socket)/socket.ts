import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../options';

interface InitUserData {
  userId: string;
}

interface JoinRoomData {
  targetUserId: string;
}

interface SendMessageData {
  targetUserId: string;
  message: string;
}

interface ReceiveMessageData {
  message: string;
  sender: string;
}

interface SocketConfig {
  serverUrl?: string;
  autoConnect?: boolean;
}

interface SocketState {
  socket: Socket | null;
  serverUrl: string;
  currentUserId: string | null;
}

let socketState: SocketState = {
  socket: null,
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  currentUserId: null
};

export const initializeSocket = (config: SocketConfig = {}): void => {
  const newServerUrl = config.serverUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  
  if (socketState.socket?.connected && socketState.serverUrl === newServerUrl) {
    return;
  }
  
  socketState.serverUrl = newServerUrl;
  
  if (socketState.socket) {
    socketState.socket.disconnect();
    socketState.socket = null;
  }
};

export default async function getSocketToken() {
  try {
    const res = await fetch("/api/auth/token", {
      method: "POST"
    });
    const data = await res.json();
    return data.token;
  } catch (error) {
    throw new Error("Failed to fetch authentication token");
  }
}

export const connectSocket = (): Promise<Socket> => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getSocketToken();

      if (socketState.socket?.connected) {
        resolve(socketState.socket);
        return;
      }

      socketState.socket = io(socketState.serverUrl, {
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: {
          token,
        },
      });

      socketState.socket.on('connect', () => {
        resolve(socketState.socket!);
      });

      socketState.socket.on('connect_error', (error: Error) => {
        reject(new Error(`Failed to connect to ${socketState.serverUrl}: ${error.message}`));
      });

      socketState.socket.on('disconnect', (reason: string) => {
        // Handle disconnect silently
      });

      socketState.socket.on('reconnect_attempt', (attempt: number) => {
        // Handle reconnection attempts silently
      });

      socketState.socket.on('reconnect', () => {
        if (socketState.currentUserId) {
          initUser(socketState.currentUserId);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const initUser = (userId: string): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.currentUserId = userId;
  socketState.socket.emit('init_user', userId);
};

export const joinPrivateRoom = (targetUserId: string): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  if (!socketState.currentUserId) {
    throw new Error('User not initialized. Call initUser() first.');
  }
  
  socketState.socket.emit('join_room', { targetUserId });
};

export const sendPrivateMessage = (targetUserId: string, message: string): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  if (!socketState.currentUserId) {
    throw new Error('User not initialized. Call initUser() first.');
  }
  
  socketState.socket.emit('send_message', { targetUserId, message });
};

export const onReceiveMessage = (callback: (data: ReceiveMessageData) => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.socket.on('receive_message', (data: ReceiveMessageData) => {
    callback(data);
  });
};

export const onConnect = (callback: () => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.socket.on('connect', callback);
};

export const onDisconnect = (callback: () => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.socket.on('disconnect', callback);
};

export const disconnectSocket = (): void => {
  if (socketState.socket) {
    socketState.socket.removeAllListeners();
    socketState.socket.disconnect();
    socketState.socket = null;
    socketState.currentUserId = null;
  }
};

export const offReceiveMessage = (): void => {
  if (socketState.socket) {
    socketState.socket.off('receive_message');
  }
};

export const offConnect = (): void => {
  if (socketState.socket) {
    socketState.socket.off('connect');
  }
};

export const offDisconnect = (): void => {
  if (socketState.socket) {
    socketState.socket.off('disconnect');
  }
};

export const isConnected = (): boolean => {
  return socketState.socket?.connected || false;
};

export const getSocket = (): Socket | null => {
  return socketState.socket;
};

export const getCurrentUserId = (): string | null => {
  return socketState.currentUserId;
};

export const cleanupListeners = (): void => {
  offReceiveMessage();
  offConnect();
  offDisconnect();
};

export type { 
  InitUserData, 
  JoinRoomData, 
  SendMessageData, 
  ReceiveMessageData, 
  SocketConfig 
};