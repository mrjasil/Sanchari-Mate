// src/components/admin/UserManagement.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { User } from '@/types/admin';
import { formatDate } from '@/lib/format';
import UserBlockModal from './UserBlockModal';

interface UserManagementProps {
  users: User[];
}

export default function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.user-row', 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.05,
          ease: 'power2.out'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [users]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const confirmBlockUser = () => {
    if (selectedUser) {
      setUsers(users.map(user =>
        user.id === selectedUser.id 
          ? { 
              ...user, 
              status: user.status === 'blocked' ? 'active' : 'blocked' as const 
            }
          : user
      ));
      setShowBlockModal(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getStatusColor = (status: User['status']) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getActionButtonText = (status: User['status']) => {
    return status === 'active' ? 'Block' : 'Unblock';
  };

  const getActionButtonStyle = (status: User['status']) => {
    return status === 'active'
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-green-500 hover:bg-green-600 text-white';
  };

  return (
    <>
      <div ref={containerRef} className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="user-row hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        Joined {formatDate(user.joinedDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.bookings} {user.bookings === 1 ? 'booking' : 'bookings'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBlockUser(user)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${getActionButtonStyle(user.status)}`}
                      >
                        {getActionButtonText(user.status)}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'No users available'}
              </p>
            </div>
          )}
        </div>
      </div>

      <UserBlockModal
        isOpen={showBlockModal}
        user={selectedUser}
        onClose={() => {
          setShowBlockModal(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmBlockUser}
      />
    </>
  );
}