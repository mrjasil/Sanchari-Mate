'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from '@/lib/alertService';

interface ChatRequestModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChatRequestModal({ onClose, onSuccess }: ChatRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { addChatRequest, setChatRequests, chatRequests } = useChatStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  // Check if user already has an approved request
  const userApprovedRequest = chatRequests.find(req => 
    req.userId === user?.id && req.status === 'approved'
  );
  const userPendingRequest = chatRequests.find(req => 
    req.userId === user?.id && req.status === 'pending'
  );

  // Convert to booleans for disabled prop
  const hasApprovedRequest = !!userApprovedRequest;
  const hasPendingRequest = !!userPendingRequest;

  const handleSubmit = async () => {
    if (!user) return;

    // Check if user already has an approved request
    if (hasApprovedRequest) {
      showErrorAlert('Already Approved', 'You already have chat access. You can start chatting now.');
      onClose();
      return;
    }

    // Check if user already has a pending request
    if (hasPendingRequest) {
      showErrorAlert('Request Already Sent', 'You already have a pending chat request. Please wait for admin approval.');
      onClose();
      return;
    }

    setIsSubmitting(true);
    const loadingAlert = showLoadingAlert('Sending chat request...');

    try {
      const response = await fetch('/api/chat/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name || user.firstName || 'User',
          userEmail: user.email || 'No email',
        }),
      });

      if (response.ok) {
        const newRequest = await response.json();
        addChatRequest(newRequest);
        closeAlert();
        showSuccessAlert('Request Sent!', 'You will be notified when approved by admin.');
        onSuccess?.();
        onClose();
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      console.error('Failed to send chat request:', error);
      closeAlert();
      showErrorAlert('Request Failed', 'Could not send chat request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Request Chat Access
        </h2>
        
        <p className="text-gray-600 mb-6">
          You need admin approval to start chatting. Send a request to get access to the chat system.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>User:</strong> {user?.name || user?.firstName || 'User'} ({user?.email || 'No email'})
          </p>
        </div>

        {/* Show warning if user already has approved access */}
        {hasApprovedRequest && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>✓ You already have chat access!</strong> You can start chatting with admin anytime.
            </p>
          </div>
        )}

        {/* Show warning if user already has pending request */}
        {hasPendingRequest && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>⏳ Request Pending:</strong> You already have a pending chat request. Please wait for admin approval.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || hasApprovedRequest || hasPendingRequest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : hasApprovedRequest ? (
              'Already Approved'
            ) : hasPendingRequest ? (
              'Request Pending'
            ) : (
              'Send Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}