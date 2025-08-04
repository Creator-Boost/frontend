// stores/chatStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Client, IMessage } from '@stomp/stompjs';
import axios from 'axios';

interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: string;
  unreadCount: number;
  project: string;
}

interface ChatState {
  client: Client | null;
  isConnected: boolean;
  conversations: Conversation[];
  currentConversation: string | null;
  messages: ChatMessage[];
  initializeWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  setCurrentConversation: (conversationId: string) => void;
  markMessagesAsRead: (conversationId: string) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (senderId: string, recipientId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  devtools((set, get) => ({
    client: null,
    isConnected: false,
    conversations: [],
    currentConversation: null,
    messages: [],

    initializeWebSocket: (userId) => {
      const client = new Client({
        brokerURL: 'ws://localhost:8088/ws',
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          set({ isConnected: true });
          
          // Subscribe to user's private queue
          client.subscribe(`/user/${userId}/queue/messages`, (message: IMessage) => {
            const notification = JSON.parse(message.body);
            const newMessage: ChatMessage = {
              id: notification.id,
              chatId: `${notification.senderId}-${notification.recipientId}`,
              senderId: notification.senderId,
              recipientId: notification.recipientId,
              content: notification.content,
              timestamp: new Date(),
              status: 'delivered'
            };
            
            set((state) => ({
              messages: [...state.messages, newMessage],
              conversations: state.conversations.map(conv => 
                conv.participant.id === notification.senderId
                  ? { ...conv, lastMessage: notification.content, unreadCount: conv.unreadCount + 1 }
                  : conv
              )
            }));
          });

          // Subscribe to public user updates
          client.subscribe('/user/public', (message: IMessage) => {
            const userUpdate = JSON.parse(message.body);
            set((state) => ({
              conversations: state.conversations.map(conv =>
                conv.participant.id === userUpdate.id
                  ? { ...conv, participant: { ...conv.participant, online: userUpdate.status === 'ONLINE' } }
                  : conv
              )
            }));
          });
        },
        onDisconnect: () => {
          set({ isConnected: false });
        },
        onStompError: (frame) => {
          console.error('WebSocket error:', frame.headers.message);
        }
      });

      client.activate();
      set({ client });
    },

    disconnectWebSocket: () => {
      const { client } = get();
      if (client) {
        client.deactivate();
      }
      set({ client: null, isConnected: false });
    },

    sendMessage: async (message) => {
      const { client } = get();
      if (client && client.connected) {
        try {
          // Optimistic update
          const optimisticMessage: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date(),
            status: 'sent'
          };
          
          set((state) => ({
            messages: [...state.messages, optimisticMessage],
            conversations: state.conversations.map(conv =>
              conv.id === message.recipientId
                ? { ...conv, lastMessage: message.content }
                : conv
            )
          }));

          // Send via WebSocket
          client.publish({
            destination: '/app/chat',
            body: JSON.stringify(message)
          });
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    },

    setCurrentConversation: (conversationId) => {
      set({ currentConversation: conversationId });
      get().markMessagesAsRead(conversationId);
    },

    markMessagesAsRead: (conversationId) => {
      set((state) => ({
        messages: state.messages.map(msg =>
          msg.senderId === conversationId && msg.status !== 'read'
            ? { ...msg, status: 'read' }
            : msg
        ),
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      }));
    },

    fetchConversations: async () => {
      try {
        const response = await axios.get('http://localhost:8088/users');
        const users = await response.data;
        
        const conversations = users.map((user: any) => ({
          id: user.id,
          participant: {
            id: user.id,
            name: user.name,
            avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`,
            online: user.status === 'ONLINE'
          },
          lastMessage: '',
          unreadCount: 0,
          project: 'Active Project' // You can modify this based on your data
        }));
        
        set({ conversations });
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    },

    fetchMessages: async (senderId, recipientId) => {
      try {
        const response = await axios.get(
          `http://localhost:8088/messages/${senderId}/${recipientId}`
        );
        const messages = response.data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          status: 'delivered'
        }));
        set({ messages });
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    }
  }))
);