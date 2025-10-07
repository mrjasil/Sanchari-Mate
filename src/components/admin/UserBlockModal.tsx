// src/components/admin/UserBlockModal.tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { User } from '@/types/admin';

interface UserBlockModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UserBlockModal({ 
  isOpen, 
  user, 
  onClose, 
  onConfirm 
}: UserBlockModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const ctx = gsap.context(() => {
        gsap.fromTo(backdropRef.current, 
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
        gsap.fromTo(modalRef.current, 
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      });

      return () => ctx.revert();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const isBlocking = user.status === 'active';
  const actionText = isBlocking ? 'Block' : 'Unblock';

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {actionText} User
        </h2>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to {actionText.toLowerCase()} <strong>{user.name}</strong>? 
          {isBlocking 
            ? ' They will not be able to access their account until unblocked.'
            : ' They will regain access to their account.'
          }
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${
              isBlocking 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {actionText} User
          </button>
        </div>
      </div>
    </div>
  );
}