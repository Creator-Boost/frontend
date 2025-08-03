import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Thanks for the great work on my YouTube channel!',
      time: '2:30 PM',
      unread: 0,
      online: true,
      project: 'YouTube Growth Strategy'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'I have some questions about the Instagram strategy',
      time: '1:15 PM',
      unread: 2,
      online: false,
      project: 'Instagram Content Strategy'
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'The TikTok content plan looks perfect!',
      time: '11:45 AM',
      unread: 0,
      online: true,
      project: 'TikTok Content Creation'
    },
    {
      id: '4',
      name: 'David Park',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Can we schedule a call to discuss the LinkedIn strategy?',
      time: 'Yesterday',
      unread: 1,
      online: false,
      project: 'LinkedIn Business Growth'
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'client',
      message: 'Hi Sarah! I just received your YouTube audit report. This is exactly what I was looking for!',
      time: '2:15 PM',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      sender: 'expert',
      message: 'I\'m so glad you found it helpful! I noticed several areas where we can really boost your channel growth.',
      time: '2:18 PM',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      sender: 'expert',
      message: 'The thumbnail optimization alone should increase your click-through rate by at least 30%.',
      time: '2:18 PM',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      sender: 'client',
      message: 'That sounds amazing! When can we start implementing these changes?',
      time: '2:25 PM',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      sender: 'expert',
      message: 'We can start right away! I\'ll send you a detailed action plan by tomorrow morning.',
      time: '2:28 PM',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '6',
      sender: 'client',
      message: 'Thanks for the great work on my YouTube channel!',
      time: '2:30 PM',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Here you would send the message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

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
                      selectedChat === conversation.id
                        ? 'bg-emerald-50 border-l-4 border-l-emerald-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{conversation.project}</p>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="ml-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {conversation.unread}
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
                            src={selectedConversation.avatar}
                            alt={selectedConversation.name}
                            className="w-10 h-10 rounded-full"
                          />
                          {selectedConversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{selectedConversation.name}</h3>
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
                        className={`flex ${message.sender === 'expert' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                          message.sender === 'expert' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <img
                            src={message.avatar}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className={`px-4 py-2 rounded-lg ${
                            message.sender === 'expert'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'expert' ? 'text-emerald-100' : 'text-gray-500'
                            }`}>
                              {message.time}
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
                        disabled={!newMessage.trim()}
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