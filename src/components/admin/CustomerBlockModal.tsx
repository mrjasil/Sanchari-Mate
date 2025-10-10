// src/components/admin/CustomerBlockModal.tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Customer } from '@/types/admin';
import { showWarningAlert } from '@/lib/alertService';

interface CustomerBlockModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  reason: string;
  onReasonChange: (reason: string) => void;
}

export default function CustomerBlockModal({ 
  isOpen, 
  customer, 
  onClose, 
  onConfirm, 
  loading = false,
  reason,
  onReasonChange 
}: CustomerBlockModalProps) {
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

  if (!isOpen || !customer) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      showWarningAlert('Reason required', 'Please provide a reason for blocking this customer.');
      return;
    }
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
          Block Customer
        </h2>
        
        <p className="text-gray-600 mb-4">
          Are you sure you want to block <strong>{customer.name}</strong>? 
          They will not be able to access their account until unblocked.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for blocking
          </label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter the reason for blocking this customer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Blocking...' : 'Block Customer'}
          </button>
        </div>
      </div>
    </div>
  );
}