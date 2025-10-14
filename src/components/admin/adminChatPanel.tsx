'use client';
import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '@/lib/alertService';

interface ChatRequest {
  id: string;
  userId: string;
  userName?: string;
  userEmail: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
  adminId?: string;
}

interface ChatSession {
  id: string;
  userId: string;
  adminId: string;
  isActive: boolean;
  startedAt: string;
  lastActivity: string;
}

export default function AdminChatPanel() {
  const { updateChatRequest, setCurrentChat, addActiveSession } = useChatStore();
  const [selectedTab, setSelectedTab] = useState<'requests' | 'active' | 'approved'>('requests');
  const [isLoading, setIsLoading] = useState(false);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);

  // Fetch chat requests on component mount and when refresh is triggered
  useEffect(() => {
    fetchChatRequests();
    fetchActiveSessions();
  }, [refreshTrigger]);

  const fetchChatRequests = async () => {
    try {
      const response = await fetch('/api/chat/requests');
      if (response.ok) {
        const requests = await response.json();
        setChatRequests(requests);
      } else {
        console.error('Failed to fetch chat requests');
      }
    } catch (error) {
      console.error('Error fetching chat requests:', error);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      // For now, we'll create mock active sessions from approved requests
      const approvedRequests = chatRequests.filter(req => req.status === 'approved');
      const sessions: ChatSession[] = approvedRequests.map(req => ({
        id: `session-${req.id}`,
        userId: req.userId,
        adminId: 'admin',
        isActive: true,
        startedAt: req.approvedAt || req.requestedAt,
        lastActivity: new Date().toISOString()
      }));
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    const result = await showConfirmDialog(
      'Approve Chat Request',
      'Are you sure you want to approve this chat request? The user will be able to start chatting with you anytime.',
      'Approve',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminId: 'admin',
          approvedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        
        // Update local state
        setChatRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );
        
        // Create active session
        const newSession: ChatSession = {
          id: `session-${requestId}`,
          userId: updatedRequest.userId,
          adminId: 'admin',
          isActive: true,
          startedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };
        
        setActiveSessions(prev => [...prev, newSession]);
        await showSuccessAlert('Request Approved', 'User can now chat with you anytime.');
        
        // Trigger refresh
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to approve request');
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
      await showErrorAlert('Approval Failed', 'Could not approve the chat request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const result = await showConfirmDialog(
      'Reject Chat Request',
      'Are you sure you want to reject this chat request? The user will be notified.',
      'Reject',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        
        // Update local state
        setChatRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );
        
        await showSuccessAlert('Request Rejected', 'The chat request has been rejected.');
        
        // Trigger refresh
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to reject request');
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      await showErrorAlert('Rejection Failed', 'Could not reject the chat request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = (userId: string, userName: string, sessionId: string) => {
    setCurrentChat({ sessionId, userId, isAdmin: true });
    setSelectedUser({ id: userId, name: userName });
    setIsChatModalOpen(true);
  };

  const handleEndSession = async (sessionId: string) => {
    const result = await showConfirmDialog(
      'End Chat Session',
      'Are you sure you want to end this chat session?',
      'End Session',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    // Update session status
    setActiveSessions(prev => 
      prev.filter(session => session.id !== sessionId)
    );
    
    await showSuccessAlert('Session Ended', 'The chat session has been ended.');
  };

  const pendingRequests = chatRequests.filter(r => r.status === 'pending');
  const approvedRequests = chatRequests.filter(r => r.status === 'approved');
  const rejectedRequests = chatRequests.filter(r => r.status === 'rejected');

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Chat Management</h2>
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-800">{pendingRequests.length}</div>
            <div className="text-sm text-yellow-600">Pending Requests</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-800">{approvedRequests.length}</div>
            <div className="text-sm text-green-600">Approved Users</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-800">{rejectedRequests.length}</div>
            <div className="text-sm text-red-600">Rejected Requests</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-800">{activeSessions.length}</div>
            <div className="text-sm text-blue-600">Active Sessions</div>
          </div>
        </div>
        
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
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`px-4 py-2 font-medium ${
              selectedTab === 'approved'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Approved Users ({approvedRequests.length})
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
            {pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {request.userName || `User ${request.userId}`}
                    </h3>
                    <p className="text-sm text-gray-600">{request.userEmail}</p>
                    <p className="text-xs text-gray-500">ID: {request.userId}</p>
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
                    disabled={isLoading}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
            
            {pendingRequests.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <p className="text-gray-500">No pending chat requests</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'approved' && (
          <div className="space-y-4">
            {approvedRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {request.userName || `User ${request.userId}`}
                    </h3>
                    <p className="text-sm text-gray-600">{request.userEmail}</p>
                    <p className="text-xs text-gray-500">ID: {request.userId}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Approved
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Approved: {new Date(request.approvedAt || request.requestedAt).toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStartChat(request.userId, request.userName || `User ${request.userId}`, `session-${request.id}`)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            ))}
            
            {approvedRequests.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">✓</div>
                <p className="text-gray-500">No approved users yet</p>
              </div>
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
                    <p className="text-sm text-gray-500">
                      Last Activity: {new Date(session.lastActivity).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartChat(session.userId, `User ${session.userId}`, session.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => handleEndSession(session.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      End
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {activeSessions.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <p className="text-gray-500">No active chat sessions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}