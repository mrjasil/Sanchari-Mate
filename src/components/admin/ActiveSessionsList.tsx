import React from 'react';
import { ChatSession } from './hooks/useAdminChat';

interface ActiveSessionsListProps {
	sessions: ChatSession[];
	onStartChat: (userId: string, sessionId: string) => void;
	onEndSession?: (sessionId: string) => void;
}

export default function ActiveSessionsList({ sessions, onStartChat, onEndSession }: ActiveSessionsListProps) {
	if (sessions.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="text-gray-400 text-6xl mb-4">💬</div>
				<p className="text-gray-500">No active chat sessions</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{sessions.map((session) => (
				<div key={session.id} className="border rounded-lg p-4 bg-gray-50">
					<div className="flex justify-between items-center">
						<div>
							<h3 className="font-semibold text-gray-800">User ID: {session.userId}</h3>
							<p className="text-sm text-gray-600">Started: {new Date(session.startedAt).toLocaleString()}</p>
							<p className="text-sm text-gray-500">Last Activity: {new Date(session.lastActivity).toLocaleString()}</p>
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() => onStartChat(session.userId, session.id)}
								className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
							>
								Chat
							</button>
							{onEndSession && (
								<button
									onClick={() => onEndSession(session.id)}
									className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
								>
									End
								</button>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}


