import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, MoreVertical, Loader } from 'lucide-react';
import { useAuthStore } from '../../context/store/authStore';
import { useChatStore } from '../../context/store/chatStore';
import { useNavigate } from 'react-router-dom';

const MessagesPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    conversations,
    selectedConversation,
    messages,
    isConnected,
    isLoading,
    selectConversation,
    sendMessage,
    loadMessages,
    initializeChat
  } = useChatStore();

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat connection
  useEffect(() => {
    if (user?.userId && !isConnected) {
      initializeChat(user.userId);
    }
  }, [user?.userId, isConnected, initializeChat]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation && user?.userId) {
      const conversation = conversations.find((conv) => conv.id === selectedConversation);
      if (conversation) {
        loadMessages(user.userId, conversation.participantId);
      }
    }
  }, [selectedConversation, user?.userId, conversations, loadMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  const selectedConversationData = conversations.find((conv) => conv.id === selectedConversation);

  // Sort messages inside conversation
  const conversationMessages = selectedConversation
    ? (messages[`${user?.userId}_${selectedConversationData?.participantId}`] || []).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    : [];

  // Filter conversations by search term
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversation.lastMessage &&
        conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort conversations by last message time (descending)
  const sortedConversations = filteredConversations
    .slice()
    .sort((a, b) => {
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return timeB - timeA;
    });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversationData && user?.userId) {
      sendMessage(selectedConversationData.participantId, newMessage.trim());
      setNewMessage('');
    }
  };

  const formatMessageTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="animate-spin h-6 w-6 text-emerald-500" />
          <span className="text-gray-600">Connecting to chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="bg-white rounded-lg shadow-sm overflow-hidden"
          style={{ height: 'calc(100vh - 8rem)' }}
        >
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                  {!isConnected && (
                    <div className="flex items-center gap-1 text-orange-500 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      Connecting...
                    </div>
                  )}
                  {isConnected && (
                    <div className="flex items-center gap-1 text-green-500 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Online
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {sortedConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {conversations.length === 0 ? (
                      <div>
                        <p className="mb-2">No conversations yet</p>
                        <p className="text-sm">
                          Visit a profile and click "Contact Me" to start chatting
                        </p>
                      </div>
                    ) : (
                      <p>No conversations match your search</p>
                    )}
                  </div>
                ) : (
                  sortedConversations.map((conversation) => {
                    // Find last message from messages state (more reliable than store's lastMessage)
                    const messageKey = `${user?.userId}_${conversation.participantId}`;
                    const convMessages = messages[messageKey] || [];
                    const lastMessage = convMessages.length > 0
                        ? convMessages[convMessages.length - 1]
                        : conversation.lastMessage
                        ? { content: conversation.lastMessage, timestamp: conversation.lastMessageTime }
                        : null;
                        
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => selectConversation(conversation.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                          selectedConversation === conversation.id
                            ? 'bg-emerald-50 border-l-4 border-l-emerald-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src={
                                conversation.participantAvatar ||
                                'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                              }
                              alt={conversation.participantName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {conversation.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {conversation.participantName}
                              </h3>
                              {lastMessage?.timestamp && (
                                <span className="text-xs text-gray-500">
                                  {formatMessageTime(lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-sm text-gray-600 truncate mt-1">
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="ml-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversationData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center cursor-pointer" onClick={() => navigate(`/profile/${selectedConversationData.participantId}`)}>
                        <div className="relative">
                          <img
                            src={
                              selectedConversationData.participantAvatar ||
                              'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                            }
                            alt={selectedConversationData.participantName}
                            className="w-10 h-10 rounded-full object-cover"
                            
                          />
                          {selectedConversationData.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900" >
                            {selectedConversationData.participantName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedConversationData.online ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversationMessages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p className="mb-2">No messages yet</p>
                        <p className="text-sm">
                          Start the conversation by sending a message below
                        </p>
                      </div>
                    ) : (
                      conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user?.userId
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                              message.senderId === user?.userId
                                ? 'flex-row-reverse space-x-reverse'
                                : ''
                            }`}
                          >
                            <img
                              src={
                                message.senderId === user?.userId
                                  ? user.imageUrl ||
                                    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                                  : selectedConversationData.participantAvatar ||
                                    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                              }
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                message.senderId === user?.userId
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.senderId === user?.userId
                                    ? 'text-emerald-100'
                                    : 'text-gray-500'
                                }`}
                              >
                                {formatMessageTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled={!isConnected}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || !isConnected}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                    {!isConnected && (
                      <p className="text-xs text-orange-500 mt-2">
                        Reconnecting to chat service...
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No conversation selected
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
