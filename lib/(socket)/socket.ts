import { io, Socket } from 'socket.io-client';

/**
 * Interface for sending messages to a specific room
 */
interface MessageData {
  roomId: string;
  message: string;
  sender: string;
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
 * This replaces the class instance variables
 */
interface SocketState {
  socket: Socket | null;
  serverUrl: string;
}

// Private state object - acts as our "singleton" state
let socketState: SocketState = {
  socket: null,
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
};

/**
 * Initializes the socket service with custom configuration
 * Call this before using other socket functions if you need custom settings
 * 
 * @param config - Configuration options for the socket service
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
 * Returns a Promise that resolves when connection is successful
 * 
 * @returns Promise<Socket> - Resolves with the connected socket instance
 * @throws Error if connection fails
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
    });
  });
};

/**
 * Gracefully disconnects from the Socket.IO server
 * Cleans up all event listeners and resets internal state
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
    
    console.log('✅ Socket disconnected successfully');
  } else {
    console.warn('⚠️  No active socket connection to disconnect');
  }
};

/**
 * Joins a specific chat room
 * Must be called after successful connection
 * 
 * @param roomId - Unique identifier for the room to join
 * @throws Error if socket is not connected
 */
export const joinRoom = (roomId: string): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  console.log(`🏠 Joining room: ${roomId}`);
  socketState.socket.emit('join_room', roomId);
};

/**
 * Sends a message to a specific room
 * All users in the room will receive this message
 * 
 * @param messageData - Object containing room ID, message content, and sender info
 * @throws Error if socket is not connected
 */
export const sendMessage = (messageData: MessageData): void => {
  if (!socketState.socket?.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  console.log(`📤 Sending message to room ${messageData.roomId}:`, messageData.message);
  socketState.socket.emit('send_message', messageData);
};

/**
 * Sets up listener for incoming messages from other users
 * The callback will be triggered whenever a message is received
 * 
 * @param callback - Function to handle received messages
 * @throws Error if socket is not connected
 */
export const onReceiveMessage = (callback: (data: ReceiveMessageData) => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  console.log('👂 Setting up message listener');
  socketState.socket.on('receive_message', (data: ReceiveMessageData) => {
    console.log(`📥 Received message from ${data.sender}:`, data.message);
    callback(data);
  });
};

/**
 * Sets up listener for connection events
 * Useful for updating UI when connection is established
 * 
 * @param callback - Function to call when connected
 * @throws Error if socket is not connected
 */
export const onConnect = (callback: () => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.socket.on('connect', callback);
};

/**
 * Sets up listener for disconnection events
 * Useful for updating UI when connection is lost
 * 
 * @param callback - Function to call when disconnected
 * @throws Error if socket is not connected
 */
export const onDisconnect = (callback: () => void): void => {
  if (!socketState.socket) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  
  socketState.socket.on('disconnect', callback);
};

/**
 * Removes the message listener to prevent memory leaks
 * Call this when component unmounts or when you no longer need to listen for messages
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
 * 
 * @returns boolean - True if connected, false otherwise
 */
export const isConnected = (): boolean => {
  const connected = socketState.socket?.connected || false;
  console.log(`🔍 Connection status: ${connected ? 'Connected' : 'Disconnected'}`);
  return connected;
};

/**
 * Returns the current socket instance
 * Useful for advanced operations not covered by this service
 * 
 * @returns Socket | null - The socket instance or null if not connected
 */
export const getSocket = (): Socket | null => {
  return socketState.socket;
};

/**
 * Utility function to clean up all listeners at once
 * Useful when component unmounts or app shuts down
 */
export const cleanupListeners = (): void => {
  console.log('🧹 Cleaning up all socket listeners');
  offReceiveMessage();
  offConnect();
  offDisconnect();
};

// Export types for use in other files
export type { MessageData, ReceiveMessageData, SocketConfig };