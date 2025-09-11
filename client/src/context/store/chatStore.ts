import { create } from 'zustand';
import { chatService, ChatMessage, ChatNotification } from '../../services/chatService';
import { useAuthStore } from './authStore';


export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  online: boolean;
}

interface ChatState {
  conversations: Conversation[];
  selectedConversation: string | null;
  messages: { [conversationId: string]: ChatMessage[] };
  isConnected: boolean;
  isLoading: boolean;
  
  // Actions
  initializeChat: (userId: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (recipientId: string, content: string) => void;
  loadMessages: (senderId: string, recipientId: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  startConversation: (participantId: string, participantName: string, participantAvatar: string) => void;
  disconnect: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: {},
  isConnected: false,
  isLoading: false,

  

  initializeChat: async (userId: string) => {
    set({ isLoading: true });
    try {
      await chatService.connect(userId);

      // Fetch previous conversations
      const previousConversations = await chatService.getConversations(userId);
      console.log('Previous conversations:', previousConversations);
      //set({ conversations: previousConversations });
      set({ conversations: Array.isArray(previousConversations) ? previousConversations : [] });
      
      // Set up message listener
      chatService.onMessageReceived((notification: ChatNotification) => {
        const newMessage: ChatMessage = {
          id: notification.id,
          chatId: `${notification.senderId}_${notification.recipientId}`,
          senderId: notification.senderId,
          recipientId: notification.recipientId,
          content: notification.content,
          timestamp: new Date(),
        };
        console.log('New message received:', newMessage);
        
        get().addMessage(newMessage);
        
        // Update conversation with new message
        const conversations = get().conversations;
        const existingConversation = conversations.find(
          conv => conv.participantId === notification.senderId
        );
        
        if (existingConversation) {
          set({
            conversations: conversations.map(conv =>
              conv.participantId === notification.senderId
                ? {
                    ...conv,
                    lastMessage: notification.content,
                    lastMessageTime: 'Just now',
                    unreadCount: conv.id === get().selectedConversation ? 0 : conv.unreadCount + 1,
                  }
                : conv
            ),
            
          });
        }
      });
      console.log('Chat initialized successfully');
      
      set({ isConnected: true });
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  selectConversation: (conversationId: string) => {
    set({ selectedConversation: conversationId });
    
    // Mark conversation as read
    const conversations = get().conversations;
    set({
      conversations: conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      ),
    });
    console.log('Conversation selected:', conversationId);
  },

  sendMessage: (recipientId: string, content: string) => {
    const state = get();
    if (!state.isConnected) return;

    // You'll need to get the current user ID from your auth store
    // ✅ Get actual userId from AuthStore
  const senderId = useAuthStore.getState().user?.userId;
  if (!senderId) return;
    
    chatService.sendMessage({
      senderId,
      recipientId,
      content,
    });

    console.log('Message sent:', { senderId, recipientId, content });

    // Add message to local state immediately for better UX
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId: `${senderId}_${recipientId}`,
      senderId,
      recipientId,
      content,
      timestamp: new Date(),
    };
    
    get().addMessage(newMessage);
  },

  loadMessages: async (senderId: string, recipientId: string) => {
    const messages = await chatService.getChatMessages(senderId, recipientId);
    const conversationId = `${senderId}_${recipientId}`;
    
    set({
      messages: {
        ...get().messages,
        [conversationId]: messages,
      },
    });
  },

  

  addMessage: (message: ChatMessage) => {
    const conversationId = message.chatId;
    const currentMessages = get().messages[conversationId] || [];
    
    set({
      messages: {
        ...get().messages,
        [conversationId]: [...currentMessages, message],
      },
    });
    console.log('Message added to state:', message);
  },

  startConversation: (participantId: string, participantName: string, participantAvatar: string) => {

    const userId = useAuthStore.getState().user?.userId;
    if (!userId) return;
      const conversations = Array.isArray(get().conversations) ? get().conversations : [];
      const existingConversation = conversations.find(conv => conv.participantId === participantId);
    
    if (!existingConversation) {
      const newConversation: Conversation = {
        id: `${userId}_${participantId}`, 
        participantId,
        participantName,
        participantAvatar,
        unreadCount: 0,
        online: false, // You might want to implement online status
      };
      
      set({
        conversations: [...conversations, newConversation],
      });
    }
    
    // Navigate to messages page and select this conversation
    const conversationId = existingConversation?.id || `${userId}_${participantId}`;
    set({ selectedConversation: conversationId });
    
  },

  disconnect: () => {
    chatService.disconnect();
    set({ isConnected: false });
  },
  
}));