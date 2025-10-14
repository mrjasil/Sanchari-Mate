export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  sessionId: string; 
}

export interface ChatRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  adminId?: string;
  disable?:boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  adminId: string;
  isActive: boolean;
  startedAt: string;
  lastActivity: string;
}