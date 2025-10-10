'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import ChatModal from './ChatModal';
import ChatRequestModal from './ChatRequestModal';
import { showWarningAlert, showInfoAlert } from '@/lib/alertService';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { chatRequests, activeSessions } = useChatStore();

  const userApprovedSession = activeSessions.find(
    session => session.userId === user?.id && session.isActive
  );

  const hasPendingRequest = chatRequests.some(
    req => req.userId === user?.id && req.status === 'pending'
  );

  const handleChatClick = () => {
    if (!isAuthenticated) {
      showWarningAlert('Login required', 'Please login to start chatting');
      return;
    }

    if (userApprovedSession) {
      setIsOpen(true);
    } else if (!hasPendingRequest) {
      setShowRequestModal(true);
    } else {
      showInfoAlert('Pending approval', 'Your chat request is pending admin approval');
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        style={{
          animation: hasPendingRequest ? 'pulse 2s infinite' : 'none'
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {hasPendingRequest && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Modals */}
      {showRequestModal && (
        <ChatRequestModal onClose={() => setShowRequestModal(false)} />
      )}
      
      {isOpen && userApprovedSession && (
        <ChatModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}