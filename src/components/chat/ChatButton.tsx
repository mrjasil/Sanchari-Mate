'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import ChatModal from './ChatModal';
import ChatRequestModal from './ChatRequestModal';
import { showSuccessAlert, showErrorAlert } from '@/lib/alertService';

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { chatRequests, currentChat, setChatRequests, setCurrentChat } = useChatStore();

  // Fetch chat requests on component mount and periodically
  useEffect(() => {
    if (user) {
      fetchChatRequests();
      // Poll for updates every 10 seconds
      const interval = setInterval(fetchChatRequests, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchChatRequests = async () => {
    try {
      const response = await fetch('/api/chat/requests');
      if (response.ok) {
        const requests = await response.json();
        setChatRequests(requests);
      }
    } catch (error) {
      console.error('Failed to fetch chat requests:', error);
    }
  };

  // Check if user has any approved request (one-time approval)
  const userApprovedRequest = chatRequests.find(req => 
    req.userId === user?.id && req.status === 'approved'
  );
  const userPendingRequest = chatRequests.find(req => 
    req.userId === user?.id && req.status === 'pending'
  );
  
  const hasApprovedRequest = !!userApprovedRequest;
  const hasPendingRequest = !!userPendingRequest;

  // Show success alert when request gets approved
  useEffect(() => {
    if (hasApprovedRequest && userApprovedRequest?.approvedAt) {
      const approvedTime = new Date(userApprovedRequest.approvedAt).getTime();
      const now = Date.now();
      // Only show alert if approved within last 30 seconds (to avoid spam)
      if (now - approvedTime < 30000) {
        showSuccessAlert(
          'Chat Approved!', 
          'Your chat request has been approved. You can now start chatting with admin anytime.'
        );
      }
    }
  }, [hasApprovedRequest, userApprovedRequest]);

  const handleChatClick = () => {
    if (!user) {
      showErrorAlert('Login Required', 'Please login to access chat.');
      return;
    }

    if (hasApprovedRequest) {
      // Set up chat session when opening chat
      const sessionId = `session-${userApprovedRequest?.id}`;
      setCurrentChat({ 
        sessionId, 
        userId: user.id, 
        isAdmin: false 
      });
      setIsChatOpen(true);
    } else if (hasPendingRequest) {
      showErrorAlert('Request Pending', 'Your chat request is pending admin approval. Please wait.');
    } else {
      setIsRequestModalOpen(true);
    }
  };

  const handleRequestSuccess = () => {
    setIsRequestModalOpen(false);
    showSuccessAlert('Request Sent', 'Your chat request has been sent to admin. You will be notified when approved.');
    // Refresh requests immediately
    fetchChatRequests();
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40"
        title={hasApprovedRequest ? 'Open Chat' : hasPendingRequest ? 'Request Pending' : 'Request Chat Access'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* Notification badge for pending requests */}
        {hasPendingRequest && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            !
          </span>
        )}
        
        {/* Notification badge for approved requests */}
        {hasApprovedRequest && (
          <span className="absolute -top-1 -right-1 bg-green-400 text-green-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            ✓
          </span>
        )}
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <ChatModal onClose={() => setIsChatOpen(false)} />
      )}

      {/* Request Modal */}
      {isRequestModalOpen && (
        <ChatRequestModal 
          onClose={() => setIsRequestModalOpen(false)}
          onSuccess={handleRequestSuccess}
        />
      )}
    </>
  );
}