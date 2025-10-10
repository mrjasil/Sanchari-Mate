import { create } from 'zustand';
import { ChatUser, ChatMessage, ChatRequest, ChatSession } from '@/types/chat';

interface ChatState {
  // State
  messages: ChatMessage[];
  chatRequests: ChatRequest[];
  activeSessions: ChatSession[];
  onlineUsers: ChatUser[];
  currentChat: {
    sessionId?: string;
    userId?: string;
    isAdmin: boolean;
  };
  
  // Actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setChatRequests: (requests: ChatRequest[]) => void;
  addChatRequest: (request: ChatRequest) => void;
  updateChatRequest: (requestId: string, updates: Partial<ChatRequest>) => void;
  setActiveSessions: (sessions: ChatSession[]) => void;
  addActiveSession: (session: ChatSession) => void;
  setOnlineUsers: (users: ChatUser[]) => void;
  setCurrentChat: (chat: { sessionId?: string; userId?: string; isAdmin: boolean }) => void;
  markMessagesAsRead: (sessionId: string, userId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  messages: [],
  chatRequests: [],
  activeSessions: [],
  onlineUsers: [],
  currentChat: { isAdmin: false },

  // Actions
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setChatRequests: (requests) => set({ chatRequests: requests }),
  addChatRequest: (request) => set((state) => ({
    chatRequests: [...state.chatRequests, request]
  })),
  updateChatRequest: (requestId, updates) => set((state) => ({
    chatRequests: state.chatRequests.map(req =>
      req.id === requestId ? { ...req, ...updates } : req
    )
  })),
  setActiveSessions: (sessions) => set({ activeSessions: sessions }),
  addActiveSession: (session) => set((state) => ({
    activeSessions: [...state.activeSessions, session]
  })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setCurrentChat: (currentChat) => set({ currentChat }),
  markMessagesAsRead: (sessionId, userId) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.receiverId === userId && !msg.read ? { ...msg, read: true } : msg
    )
  })),
}));