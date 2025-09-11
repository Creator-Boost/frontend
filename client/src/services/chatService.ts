import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Conversation } from '../context/store/chatStore';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
}

export interface ChatNotification {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
}

class ChatService {
  private stompClient: Client | null = null;
  private connected = false;
  private messageCallbacks: ((message: ChatNotification) => void)[] = [];

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
      });

      this.stompClient.onConnect = () => {
        console.log('Connected to WebSocket');
        this.connected = true;

        // Subscribe to user's message queue
        this.stompClient?.subscribe(`/user/${userId}/queue/messages`, (message) => {
          const notification: ChatNotification = JSON.parse(message.body);
          this.messageCallbacks.forEach(callback => callback(notification));
        });

        resolve();
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        this.connected = false;
        reject(new Error('WebSocket connection failed'));
      };

      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  sendMessage(message: Omit<ChatMessage, 'id' | 'chatId' | 'timestamp'>) {
    if (this.stompClient && this.connected) {
      const messageToSend = {
        ...message,
        timestamp: new Date(),
      };
      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(messageToSend),
      });
    }
  }

  onMessageReceived(callback: (message: ChatNotification) => void) {
    this.messageCallbacks.push(callback);
  }

  removeMessageCallback(callback: (message: ChatNotification) => void) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  async getChatMessages(senderId: string, recipientId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`http://localhost:8080/messages/${senderId}/${recipientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const response = await fetch(`http://localhost:8080/conversations/${userId}`);
    console.log('Fetch conversations response:', response); 
    return await response.json();
  }
}

export const chatService = new ChatService();