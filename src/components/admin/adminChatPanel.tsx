'use client';
import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';

export default function AdminChatPanel() {
  const { chatRequests, activeSessions, onlineUsers, updateChatRequest, setCurrentChat } = useChatStore();
  const [selectedTab, setSelectedTab] = useState<'requests' | 'active'>('requests');

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/chat/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminId: 'admin', // In real app, use actual admin ID
          approvedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        updateChatRequest(requestId, updatedRequest);
        
        // Create active session
        const newSession = {
          id: Date.now().toString(),
          userId: updatedRequest.userId,
          adminId: 'admin',
          isActive: true,
          startedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };
        
        // You would typically save this to your backend
        console.log('New session created:', newSession);
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/chat/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        updateChatRequest(requestId, updatedRequest);
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleStartChat = (userId: string, sessionId: string) => {
    setCurrentChat({ sessionId, userId, isAdmin: true });
    // You would open a chat interface here
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chat Management</h2>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setSelectedTab('requests')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'requests'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Pending Requests ({chatRequests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setSelectedTab('active')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'active'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Active Chats ({activeSessions.length})
        </button>
      </div>

      {/* Content */}
      {selectedTab === 'requests' && (
        <div className="space-y-4">
          {chatRequests.filter(r => r.status === 'pending').map((request) => (
            <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{request.userName}</h3>
                  <p className="text-sm text-gray-600">{request.userEmail}</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Pending
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Requested: {new Date(request.requestedAt).toLocaleString()}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproveRequest(request.id)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          
          {chatRequests.filter(r => r.status === 'pending').length === 0 && (
            <p className="text-gray-500 text-center py-8">No pending chat requests</p>
          )}
        </div>
      )}

      {selectedTab === 'active' && (
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    User ID: {session.userId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Started: {new Date(session.startedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleStartChat(session.userId, session.id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
          
          {activeSessions.length === 0 && (
            <p className="text-gray-500 text-center py-8">No active chat sessions</p>
          )}
        </div>
      )}
    </div>
  );
}