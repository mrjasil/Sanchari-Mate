import { useEffect, useState, useCallback } from 'react';

export interface ChatRequest {
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

export interface ChatSession {
	id: string;
	userId: string;
	adminId: string;
	isActive: boolean;
	startedAt: string;
	lastActivity: string;
}

export const useAdminChat = () => {
	const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
	const [activeSessions, setActiveSessions] = useState<ChatSession[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchChatRequests = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('/api/chat/requests');
			if (!res.ok) throw new Error('Failed to fetch chat requests');
			const data = await res.json();
			setChatRequests(data || []);
		} catch (e: any) {
			setError(e?.message || 'Failed to fetch chat data');
		} finally {
			setLoading(false);
		}
	}, []);

	const approveRequest = useCallback(async (requestId: string) => {
		const res = await fetch(`/api/chat/requests/${requestId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: 'approved', adminId: 'admin', approvedAt: new Date().toISOString() }),
		});
		if (!res.ok) throw new Error('Failed to approve request');
		const updated = await res.json();
		setChatRequests(prev => prev.map(r => r.id === requestId ? updated : r));
		setActiveSessions(prev => ([...prev, {
			id: `session-${requestId}`,
			userId: updated.userId,
			adminId: 'admin',
			isActive: true,
			startedAt: new Date().toISOString(),
			lastActivity: new Date().toISOString()
		}]));
	}, []);

	const rejectRequest = useCallback(async (requestId: string) => {
		const res = await fetch(`/api/chat/requests/${requestId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: 'rejected', rejectedAt: new Date().toISOString() }),
		});
		if (!res.ok) throw new Error('Failed to reject request');
		const updated = await res.json();
		setChatRequests(prev => prev.map(r => r.id === requestId ? updated : r));
	}, []);

	useEffect(() => { fetchChatRequests(); }, [fetchChatRequests]);

	return {
		chatRequests,
		activeSessions,
		loading,
		error,
		refresh: fetchChatRequests,
		approveRequest,
		rejectRequest,
	};
};


