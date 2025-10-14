import React from 'react';
import { ChatRequest } from './hooks/useAdminChat';

interface RequestsListProps {
	requests: ChatRequest[];
	onApprove: (id: string) => Promise<void> | void;
	onReject: (id: string) => Promise<void> | void;
	loading?: boolean;
}

export default function RequestsList({ requests, onApprove, onReject, loading }: RequestsListProps) {
	const pending = requests.filter(r => r.status === 'pending');

	if (pending.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="text-gray-400 text-6xl mb-4">💬</div>
				<p className="text-gray-500">No pending chat requests</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{pending.map((request) => (
				<div key={request.id} className="border rounded-lg p-4 bg-gray-50">
					<div className="flex justify-between items-start mb-3">
						<div>
							<h3 className="font-semibold text-gray-800">{request.userName || `User ${request.userId}`}</h3>
							<p className="text-sm text-gray-600">{request.userEmail}</p>
						</div>
						<span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
					</div>
					<p className="text-sm text-gray-600 mb-3">Requested: {new Date(request.requestedAt).toLocaleString()}</p>
					<div className="flex space-x-2">
						<button
							onClick={() => onApprove(request.id)}
							disabled={loading}
							className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? 'Processing...' : 'Approve'}
						</button>
						<button
							onClick={() => onReject(request.id)}
							disabled={loading}
							className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? 'Processing...' : 'Reject'}
						</button>
					</div>
				</div>
			))}
		</div>
	);
}


