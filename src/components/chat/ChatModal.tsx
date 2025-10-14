'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { gsap } from 'gsap';
import { showErrorAlert, showSuccessAlert } from '@/lib/alertService';

interface ChatModalProps {
  onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const { messages, addMessage, currentChat, onlineUsers, setCurrentChat, setMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session when modal opens
  useEffect(() => {
    if (user && currentChat.sessionId) {
      setIsConnected(true);
      loadMessages();
      
      // Add welcome message if no messages exist
      if (messages.length === 0) {
        const welcomeMessage = {
          id: `welcome-${Date.now()}`,
          senderId: 'admin',
          receiverId: user.id,
          content: 'Hello! You are now connected to admin chat. How can I help you?',
          type: 'text' as const,
          sessionId: currentChat.sessionId,
          timestamp: new Date().toISOString(),
          read: false
        };
        addMessage(welcomeMessage);
      }
    }
  }, [user, currentChat.sessionId]);

  const loadMessages = async () => {
    if (!currentChat.sessionId) return;
    
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${currentChat.sessionId}`);
      if (response.ok) {
        const messages = await response.json();
        setMessages(messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !isConnected || isLoading) return;

    const sessionId = currentChat?.sessionId || `temp-${Date.now()}`;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: 'admin',
      content: message.trim(),
      type: 'text' as const,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      read: false
    };

    setIsLoading(true);
    try {
      // Add message to local state immediately
      addMessage(newMessage);
      setMessage('');
      
      // Send to API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Simulate admin response (in real app, this would be via WebSocket)
      setTimeout(() => {
        const adminResponse = {
          id: `admin-${Date.now()}`,
          senderId: 'admin',
          receiverId: user.id,
          content: 'Thank you for your message. Admin will respond shortly.',
          type: 'text' as const,
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
          read: false
        };
        addMessage(adminResponse);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      showErrorAlert('Send Failed', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.2,
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  // Safe online users count
  const onlineUsersCount = onlineUsers?.length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50 p-4 pb-20">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col"
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Travel Agency Chat</h3>
            <p className="text-sm opacity-90">
              {isConnected ? 'Connected to Admin' : 'Connecting...'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-blue-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.senderId === user?.id
                      ? 'bg-blue-600 text-white' // User messages
                      : 'bg-white text-gray-800 border border-gray-200' // Admin messages
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.senderId === user?.id ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected || isLoading}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected || isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}