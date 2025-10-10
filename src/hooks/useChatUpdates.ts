import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';

export function useChatUpdates() {
  const { setChatRequests, setActiveSessions, setOnlineUsers, addMessage } = useChatStore();

  useEffect(() => {
    const eventSource = new EventSource('/api/chat/updates');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'new_message':
          addMessage(data.message);
          break;
        case 'chat_request_update':
          // You would update chat requests here
          break;
        case 'online_users_update':
          setOnlineUsers(data.users);
          break;
      }
    };

    return () => eventSource.close();
  }, [addMessage, setOnlineUsers]);
}