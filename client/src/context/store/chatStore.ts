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
  markMessagesAsSeen: (conversationId: string) => Promise<void>;
  handleIncomingMessage: (message: ChatMessage) => void;
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

      const conversations: Conversation[] = Array.isArray(previousConversations) ? previousConversations : [];
      const messagesState: { [key: string]: ChatMessage[] } = {};

      // Load messages for each conversation to calculate unread counts
      for (const conv of conversations) {
        const convMessages = await chatService.getChatMessages(userId, conv.participantId);
        const conversationId = `${userId}_${conv.participantId}`;
        messagesState[conversationId] = convMessages;

        // Count unread messages for current user
        const unreadCount = convMessages.filter(msg => !msg.seen && msg.recipientId === userId).length;
        conv.unreadCount = unreadCount;

        console.log(`Conversation ${conv.participantName} has ${unreadCount} unread messages`);
      }

      set({ conversations, messages: messagesState });

      // Set up message listener for real-time updates
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

        // Update conversation with last message and unread count
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
                    unreadCount: conv.id === get().selectedConversation ? 0 : (conv.unreadCount || 0) + 1,
                  }
                : conv
            ),
          });
        }

        // Log updated unread counts for all conversations
        get().conversations.forEach(conv => {
          console.log(`Conversation ${conv.participantName} has ${conv.unreadCount} unread messages`);
        });
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
    console.log(`Selected conversation ${conversationId}, unread reset`);

    // also mark all unseen messages as seen
    useChatStore.getState().markMessagesAsSeen(conversationId);
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

    // Add message to local state
    const updatedMessages = [...currentMessages, message];

    // Update unread count for conversation
    const conversations = get().conversations;
    const userId = useAuthStore.getState().user?.userId;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        const isActive = conv.id === get().selectedConversation;
        const unreadIncrement = message.recipientId === userId && !isActive ? 1 : 0;
        return {
          ...conv,
          lastMessage: message.content,
          lastMessageTime: message.timestamp instanceof Date ? message.timestamp.toISOString() : String(message.timestamp),
          unreadCount: (conv.unreadCount || 0) + unreadIncrement,
        };
      }
      return conv;
    });

    set({
      messages: { ...get().messages, [conversationId]: updatedMessages },
      conversations: updatedConversations,
    });

    // Log unread counts
    updatedConversations.forEach(conv => {
      console.log(`Conversation ${conv.participantName} has ${conv.unreadCount} unread messages`);
    });
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

  markMessagesAsSeen: async (conversationId: string) => {
    const { messages } = get();
    const conversationMessages = messages[conversationId] || [];
    const userId = useAuthStore.getState().user?.userId;

    // Find unseen messages (where current user is recipient)
    const unseenMessages = conversationMessages.filter(
      (msg) => !msg.seen && msg.recipientId === userId
    );

    for (const msg of unseenMessages) {
      await chatService.markMessageAsSeen(msg.id);
      msg.seen = true; // update local state
    }

    // Update local store
    set({
      messages: {
        ...messages,
        [conversationId]: [...conversationMessages],
      },
    });
  },

   handleIncomingMessage: (message: ChatMessage) => {
    const { messages, selectedConversation, conversations } = get();
    const chatId = message.chatId;

    const existingMessages = messages[chatId] || [];
    const updatedMessages = [...existingMessages, message];

    // update messages list
    const newMessages = { ...messages, [chatId]: updatedMessages };
    if (selectedConversation === chatId) {
      chatService.markMessageAsSeen(message.id);
      message.seen = true;
    }

    // update conversations list
    const updatedConversations = conversations.map(conv => {
      if (conv.id === chatId) {
        const isActive = selectedConversation === conv.id;
        return {
          ...conv,
          lastMessage: message.content,
          lastMessageTime: message.timestamp instanceof Date ? message.timestamp.toISOString() : String(message.timestamp),
          unreadCount: isActive ? 0 : (conv.unreadCount || 0) + 1,
        };
      }
      return conv;
    });

    set({ messages: newMessages, conversations: updatedConversations });
  },

  
}));