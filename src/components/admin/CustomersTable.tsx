'use client';
import { useState } from 'react';
import { Customer } from '@/types/admin';
import { useAdminStore } from '@/store/adminStore';
import UserBlockModal from './UserBlockModal';

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { blockUser, unblockUser } = useAdminStore();

  const handleBlockClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowBlockModal(true);
  };

  const handleBlockConfirm = async (reason: string) => {
    if (selectedCustomer) {
      try {
        setActionLoading(selectedCustomer.id);
        await blockUser(selectedCustomer.id, reason);
        setShowBlockModal(false);
        setSelectedCustomer(null);
      } catch (error) {
        console.error('Failed to block user:', error);
        // You can add a toast notification here
        alert('Failed to block user. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleUnblock = async (customerId: string) => {
    try {
      setActionLoading(customerId);
      await unblockUser(customerId);
    } catch (error) {
      console.error('Failed to unblock user:', error);
      // You can add a toast notification here
      alert('Failed to unblock user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="customers-table">
        <div className="table-header">
          <h3>Customer Management</h3>
          <div className="table-actions">
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="search-input"
            />
            <button className="btn-primary">Export</button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bookings</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className={customer.isBlocked ? 'blocked' : ''}>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-id">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <span className="booking-count">{customer.totalBookings}</span>
                </td>
                <td>
                  {customer.isBlocked ? (
                    <span className="status-badge blocked">Blocked</span>
                  ) : (
                    <span className="status-badge active">Active</span>
                  )}
                </td>
                <td>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view">View</button>
                    {customer.isBlocked ? (
                      <button 
                        className="btn-success"
                        onClick={() => handleUnblock(customer.id)}
                        disabled={actionLoading === customer.id}
                      >
                        {actionLoading === customer.id ? '...' : 'Unblock'}
                      </button>
                    ) : (
                      <button 
                        className="btn-danger"
                        onClick={() => handleBlockClick(customer)}
                        disabled={actionLoading === customer.id}
                      >
                        {actionLoading === customer.id ? '...' : 'Block'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserBlockModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={handleBlockConfirm}
        customer={selectedCustomer}
        loading={actionLoading === selectedCustomer?.id}
      />
    </>
  );
}