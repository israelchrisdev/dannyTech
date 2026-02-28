import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, PaperAirplaneIcon, UserIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/outline';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setConversations([
          {
            id: 1,
            with: {
              id: 101,
              name: 'sarah_seller',
              avatar: null,
              online: true,
              lastSeen: 'just now'
            },
            lastMessage: {
              id: 1001,
              content: 'Hi, is this still available?',
              timestamp: '2024-01-20T10:30:00Z',
              unread: true
            },
            product: {
              id: 201,
              title: 'Vintage Camera',
              image: 'https://via.placeholder.com/50',
              price: 299.99
            },
            unreadCount: 1
          },
          {
            id: 2,
            with: {
              id: 102,
              name: 'mike_collector',
              avatar: null,
              online: false,
              lastSeen: '2024-01-20T08:15:00Z'
            },
            lastMessage: {
              id: 1002,
              content: 'I can offer $450 for the watch',
              timestamp: '2024-01-20T09:45:00Z',
              unread: false
            },
            product: {
              id: 202,
              title: 'Rolex Watch',
              image: 'https://via.placeholder.com/50',
              price: 599.99
            },
            unreadCount: 0
          },
          {
            id: 3,
            with: {
              id: 103,
              name: 'antique_shop',
              avatar: null,
              online: true,
              lastSeen: 'just now'
            },
            lastMessage: {
              id: 1003,
              content: 'The chair is still available. When would you like to pick it up?',
              timestamp: '2024-01-19T16:20:00Z',
              unread: false
            },
            product: {
              id: 203,
              title: 'Antique Chair',
              image: 'https://via.placeholder.com/50',
              price: 199.99
            },
            unreadCount: 0
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = (conversationId) => {
    // Simulate API call
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          conversationId: 1,
          senderId: 101,
          senderName: 'sarah_seller',
          content: 'Hi, is this still available?',
          timestamp: '2024-01-20T10:30:00Z',
          isMe: false
        },
        {
          id: 2,
          conversationId: 1,
          senderId: 'me',
          senderName: 'Me',
          content: 'Yes, it is! Are you interested?',
          timestamp: '2024-01-20T10:32:00Z',
          isMe: true
        },
        {
          id: 3,
          conversationId: 1,
          senderId: 101,
          senderName: 'sarah_seller',
          content: 'Great! What condition is it in?',
          timestamp: '2024-01-20T10:33:00Z',
          isMe: false
        },
        {
          id: 4,
          conversationId: 1,
          senderId: 'me',
          senderName: 'Me',
          content: 'It\'s in excellent condition. I can send more photos if you\'d like.',
          timestamp: '2024-01-20T10:35:00Z',
          isMe: true
        }
      ]);
    }, 500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now(),
        conversationId: selectedConversation,
        senderId: 'me',
        senderName: 'Me',
        content: messageInput,
        timestamp: new Date().toISOString(),
        isMe: true
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
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

  if (loading) {
    return (
      <div className="h-[calc(100vh-12rem)] bg-white rounded-lg shadow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] bg-white rounded-lg shadow flex overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold mb-2">Messages</h2>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 border-b transition ${
                selectedConversation === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                {conv.with.avatar ? (
                  <img
                    src={conv.with.avatar}
                    alt={conv.with.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                {conv.with.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{conv.with.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatTime(conv.lastMessage.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {conv.lastMessage.content}
                </p>
                <div className="flex items-center mt-2">
                  <img
                    src={conv.product.image}
                    alt={conv.product.title}
                    className="h-5 w-5 rounded object-cover mr-1"
                  />
                  <span className="text-xs text-gray-500 truncate">
                    {conv.product.title}
                  </span>
                </div>
              </div>

              {/* Unread Badge */}
              {conv.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Conversation Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <p className="font-medium">sarah_seller</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <PhoneIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <VideoCameraIcon className="h-5 w-5" />
              </button>
              <Link
                to="/product/1"
                className="text-sm text-blue-600 hover:underline px-3 py-2"
              >
                View Item
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isMe && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );
};

export default Messages;