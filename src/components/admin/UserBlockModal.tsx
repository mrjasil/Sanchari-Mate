'use client';
import { useState } from 'react';
import { Customer } from '@/types/admin';

interface UserBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  customer: Customer | null;
}

export default function UserBlockModal({
  isOpen,
  onClose,
  onConfirm,
  customer
}: UserBlockModalProps) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !customer) return null;

  const predefinedReasons = [
    'Suspicious Activity',
    'Fraudulent Booking',
    'Payment Issues',
    'Inappropriate Behavior',
    'Terms Violation',
    'Spam Account'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'other' ? customReason : reason;
    if (finalReason.trim()) {
      onConfirm(finalReason);
      setReason('');
      setCustomReason('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Block User</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body">
          <p>
            You are about to block <strong>{customer.name}</strong> ({customer.email})
          </p>
          
          <form onSubmit={handleSubmit} className="block-form">
            <div className="form-group">
              <label>Block Reason *</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                {predefinedReasons.map((predefinedReason) => (
                  <option key={predefinedReason} value={predefinedReason}>
                    {predefinedReason}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
            
            {reason === 'other' && (
              <div className="form-group">
                <label>Custom Reason</label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please provide specific details..."
                  rows={3}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                Cancel all pending bookings
              </label>
            </div>
            
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-danger">
                Confirm Block
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}