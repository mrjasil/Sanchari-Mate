'use client';
import { useState } from 'react';
import { showSuccessAlert, showErrorAlert } from '@/lib/alertService';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

interface ChatRequestModalProps {
  onClose: () => void;
  
}

export default function ChatRequestModal({ onClose }: ChatRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { addChatRequest } = useChatStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/chat/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        }),
      });

      if (response.ok) {
        const newRequest = await response.json();
        addChatRequest(newRequest);
        onClose();
        showSuccessAlert('Request sent', 'You will be notified when approved.');
      }
    } catch (error) {
      console.error('Failed to send chat request:', error);
      showErrorAlert('Failed', 'Could not send chat request.');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
            <strong>User:</strong> {user?.name} ({user?.email})
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
}