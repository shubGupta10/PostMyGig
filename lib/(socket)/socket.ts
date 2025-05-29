import { io, Socket } from 'socket.io-client';

/**
 * Interface for initializing user on socket connection
 */
interface InitUserData {
  userId: string;
}

/**
 * Interface for joining a private room
 */
interface JoinRoomData {
  targetUserId: string;
}

/**
 * Interface for sending private messages
 */
interface SendMessageData {
  targetUserId: string;
  message: string;
}

/**
 * Interface for receiving messages from other users
 */
interface ReceiveMessageData {
  message: string;
  sender: string;
}

/**
 * Socket service configuration options
 */
interface SocketConfig {
  serverUrl?: string;
  autoConnect?: boolean;
}

/**
 * Internal state for the socket service
 */
interface SocketState {
  socket: Socket | null;
  serverUrl: string;
  currentUserId: string | null;
}

// Private state object - acts as our "singleton" state
let socketState: SocketState = {
  socket: null,
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  currentUserId: null
};

/**
 * Initializes the socket service with custom configuration
 */
export const initializeSocket = (config: SocketConfig = {}): void => {
  const newServerUrl = config.serverUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  
  // If socket is already connected and URL hasn't changed, keep existing connection
  if (socketState.socket?.connected && socketState.serverUrl === newServerUrl) {
    return;
  }
  
  // Update server URL
  socketState.serverUrl = newServerUrl;
  
  // Disconnect existing socket if URL has changed
  if (socketState.socket) {
    socketState.socket.disconnect();
    socketState.socket = null;
  }
};

/**
 * Establishes connection to the Socket.IO server
 */
export const connectSocket = (): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    // Return existing connection if already connected
    if (socketState.socket?.connected) {
      console.log('Socket already connected:', socketState.socket.id);
      resolve(socketState.socket);
      return;
    }

    // Create new socket connection
    socketState.socket = io(socketState.serverUrl, {
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Handle successful connection
    socketState.socket.on('connect', () => {
      console.log('✅ Connected to server:', socketState.socket?.id);
      console.log('🌐 Server URL:', socketState.serverUrl);
      resolve(socketState.socket!);
    });

    // Handle connection errors
    socketState.socket.on('connect_error', (error: Error) => {
      console.error('❌ Connection failed:', error.message);
      reject(new Error(`Failed to connect to ${socketState.serverUrl}: ${error.message}`));
    });

    // Handle unexpected disconnections
    socketState.socket.on('disconnect', (reason: string) => {
      console.warn('🔌 Disconnected from server. Reason:', reason);
    });

    // Handle reconnection attempts
    socketState.socket.on('reconnect_attempt', (attempt: number) => {
      console.log(`🔄 Reconnection attempt #${attempt}`);
    });

    // Handle successful reconnection
    socketState.socket.on('reconnect', () => {
      console.log('✅ Reconnected to server');
      // Re-initialize user if we have a userId stored
      if (socketState.currentUserId) {
        initUser(socketState.currentUserId);
      }
    });
  });
};

/**
 * Initialize user on the socket connection
 */
export const initUser = (userId: string): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.currentUserId = userId;
  console.log(`👤 Initializing user: ${userId}`);
  socketState.socket.emit('init_user', userId);
};

/**
 * Joins a private room with target user
 */
export const joinPrivateRoom = (targetUserId: string): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  if (!socketState.currentUserId) {
    throw new Error('User not initialized. Call initUser() first.');
  }
  
  console.log(`🏠 Joining private room with user: ${targetUserId}`);
  socketState.socket.emit('join_room', { targetUserId });
};

/**
 * Sends a private message to target user
 */
export const sendPrivateMessage = (targetUserId: string, message: string): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  if (!socketState.currentUserId) {
    throw new Error('User not initialized. Call initUser() first.');
  }
  
  console.log(`📤 Sending private message to ${targetUserId}:`, message);
  socketState.socket.emit('send_message', { targetUserId, message });
};

/**
 * Sets up listener for incoming private messages
 */
export const onReceiveMessage = (callback: (data: ReceiveMessageData) => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  console.log('👂 Setting up private message listener');
  socketState.socket.on('receive_message', (data: ReceiveMessageData) => {
    console.log(`📥 Received private message from ${data.sender}:`, data.message);
    callback(data);
  });
};

/**
 * Sets up listener for connection events
 */
export const onConnect = (callback: () => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.socket.on('connect', callback);
};

/**
 * Sets up listener for disconnection events
 */
export const onDisconnect = (callback: () => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.socket.on('disconnect', callback);
};

/**
 * Gracefully disconnects from the Socket.IO server
 */
export const disconnectSocket = (): void => {
  if (socketState.socket) {
    console.log('🔌 Disconnecting from server...');
    
    // Remove all listeners to prevent memory leaks
    socketState.socket.removeAllListeners();
    
    // Disconnect from server
    socketState.socket.disconnect();
    
    // Reset internal state
    socketState.socket = null;
    socketState.currentUserId = null;
    
    console.log('✅ Socket disconnected successfully');
  } else {
    console.warn('⚠️  No active socket connection to disconnect');
  }
};

/**
 * Removes the message listener to prevent memory leaks
 */
export const offReceiveMessage = (): void => {
  if (socketState.socket) {
    console.log('🔇 Removing message listener');
    socketState.socket.off('receive_message');
  }
};

/**
 * Removes the connection listener
 */
export const offConnect = (): void => {
  if (socketState.socket) {
    socketState.socket.off('connect');
  }
};

/**
 * Removes the disconnection listener
 */
export const offDisconnect = (): void => {
  if (socketState.socket) {
    socketState.socket.off('disconnect');
  }
};

/**
 * Checks if the socket is currently connected to the server
 */
export const isConnected = (): boolean => {
  const connected = socketState.socket?.connected || false;
  console.log(`🔍 Connection status: ${connected ? 'Connected' : 'Disconnected'}`);
  return connected;
};

/**
 * Returns the current socket instance
 */
export const getSocket = (): Socket | null => {
  return socketState.socket;
};

/**
 * Returns the current user ID
 */
export const getCurrentUserId = (): string | null => {
  return socketState.currentUserId;
};

/**
 * Utility function to clean up all listeners at once
 */
export const cleanupListeners = (): void => {
  console.log('🧹 Cleaning up all socket listeners');
  offReceiveMessage();
  offConnect();
  offDisconnect();
};

// Export types for use in other files
export type { 
  InitUserData, 
  JoinRoomData, 
  SendMessageData, 
  ReceiveMessageData, 
  SocketConfig 
};