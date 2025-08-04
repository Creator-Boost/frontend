import React, { useEffect, useState } from 'react';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';

import { useChatStore } from '../../context/store/chatStore';
import { useAuthStore } from '../../context/store/authStore';

const MessagesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState('1');
  

  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    currentConversation,
    isConnected,
    initializeWebSocket,
    disconnectWebSocket,
    sendMessage,
    setCurrentConversation,
    fetchConversations,
    fetchMessages
  } = useChatStore();

  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      initializeWebSocket(user.userId);
      fetchConversations().finally(() => setIsLoading(false));
    }
    
    return () => {
      disconnectWebSocket();
    };
  }, [user?.userId]);


  useEffect(() => {
    if (currentConversation && user?.userId) {
      fetchMessages(user.userId, currentConversation);
    }
  }, [currentConversation, user?.userId]);





  const selectedConversation = conversations.find(conv => conv.id === currentConversation);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentConversation && user?.userId) {
      await sendMessage({
        chatId: `${user.userId}-${currentConversation}`,
        senderId: user.userId,
        recipientId: currentConversation,
        content: newMessage
      });
      setNewMessage('');
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please login to view messages</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading conversations...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      currentConversation === conversation.id
                        ? 'bg-emerald-50 border-l-4 border-l-emerald-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={conversation.participant.avatar}
                          alt={conversation.participant.name}
                          className="w-12 h-12 rounded-full"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.currentTarget;
                            target.src = `https://ui-avatars.com/api/?name=${conversation.participant.name}&background=random`;
                          }}
                        />
                        {conversation.participant.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          <span className="text-xs text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{conversation.project}</p>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="ml-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={selectedConversation.participant.avatar}
                            alt={selectedConversation.participant.name}
                            className="w-10 h-10 rounded-full"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.currentTarget;
                              target.src = `https://ui-avatars.com/api/?name=${selectedConversation.participant.name}&background=random`;
                            }}
                          />
                          {selectedConversation.participant.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{selectedConversation.participant.name}</h3>
                          <p className="text-sm text-gray-600">{selectedConversation.project}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                          message.senderId === user.userId ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <img
                            src={
                              message.senderId === user.userId
                                ? `https://ui-avatars.com/api/?name=${user.name}&background=random`
                                : selectedConversation.participant.avatar
                            }
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className={`px-4 py-2 rounded-lg ${
                            message.senderId === user.userId
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user.userId ? 'text-emerald-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {message.status === 'sent' && ' • Sending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || !isConnected}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white p-2 rounded-lg"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
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