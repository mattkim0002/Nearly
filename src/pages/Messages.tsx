import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface MessagesProps {
  user: any;
  onSignOut: () => void;
}

interface Conversation {
  id: string;
  otherUser: {
    name: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  sent: boolean;
}

// Mock conversations (in production, this comes from database)
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    otherUser: {
      name: 'Michael Chen',
      avatar: 'MC',
      online: true,
    },
    lastMessage: 'I can definitely help with that project. When would you like to schedule a consultation?',
    timestamp: '2 min ago',
    unread: 2,
  },
  {
    id: '2',
    otherUser: {
      name: 'Sarah Martinez',
      avatar: 'SM',
      online: false,
    },
    lastMessage: 'Thanks for your interest! I have availability next week.',
    timestamp: '1 hour ago',
    unread: 0,
  },
  {
    id: '3',
    otherUser: {
      name: 'David Park',
      avatar: 'DP',
      online: true,
    },
    lastMessage: 'Perfect! I\'ll send over the proposal by tomorrow.',
    timestamp: 'Yesterday',
    unread: 0,
  },
];

// Mock messages for a conversation
const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      senderId: 'other',
      text: 'Hi! I saw your job posting for custom furniture. I have 12 years of experience and would love to help!',
      timestamp: '10:30 AM',
      sent: true,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Great! I need a custom dining table made from walnut. Do you have a portfolio I can see?',
      timestamp: '10:35 AM',
      sent: true,
    },
    {
      id: '3',
      senderId: 'other',
      text: 'Absolutely! I\'ve sent you a link to my portfolio. I\'ve done several dining tables in walnut.',
      timestamp: '10:40 AM',
      sent: true,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Wow, your work is beautiful! What\'s your timeline and pricing for an 8-foot table?',
      timestamp: '10:45 AM',
      sent: true,
    },
    {
      id: '5',
      senderId: 'other',
      text: 'I can definitely help with that project. When would you like to schedule a consultation?',
      timestamp: 'Just now',
      sent: true,
    },
  ],
  '2': [
    {
      id: '1',
      senderId: 'other',
      text: 'Hello! I create handmade pottery and would love to work on your custom dinnerware set!',
      timestamp: 'Yesterday',
      sent: true,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'That sounds perfect! I\'m looking for a set of 8 bowls and plates. What colors do you work with?',
      timestamp: 'Yesterday',
      sent: true,
    },
    {
      id: '3',
      senderId: 'other',
      text: 'I have a wide range of glazes available! Ocean blues, earthy greens, warm terracotta. I can send you my color palette.',
      timestamp: 'Yesterday',
      sent: true,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'I love the ocean blue! How long would it take?',
      timestamp: 'Yesterday',
      sent: true,
    },
    {
      id: '5',
      senderId: 'other',
      text: 'Thanks for your interest! I have availability next week.',
      timestamp: '1 hour ago',
      sent: true,
    },
  ],
  '3': [
    {
      id: '1',
      senderId: 'other',
      text: 'Hi! I specialize in modern web design and I\'d love to help with your website project.',
      timestamp: '2 days ago',
      sent: true,
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Great! I need a portfolio website for my photography business. Do you have examples of your work?',
      timestamp: '2 days ago',
      sent: true,
    },
    {
      id: '3',
      senderId: 'other',
      text: 'Yes! I\'ve done several portfolio sites for photographers. Check out my portfolio at davidparkdesign.com',
      timestamp: '2 days ago',
      sent: true,
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Your work looks amazing! What would be the cost and timeline?',
      timestamp: 'Yesterday',
      sent: true,
    },
    {
      id: '5',
      senderId: 'other',
      text: 'Perfect! I\'ll send over the proposal by tomorrow.',
      timestamp: 'Yesterday',
      sent: true,
    },
  ],
};

export default function Messages({ user, onSignOut }: MessagesProps) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      // Load messages for selected conversation
      setMessages(MOCK_MESSAGES[selectedConversation] || []);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);

    // Add message to conversation (in production, this would save to database)
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: 'Just now',
      sent: true,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Bluedot</span>
            </div>

            <div className="flex items-center gap-4">
              <ProfileDropdown user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden h-[calc(100vh-180px)] flex flex-col">
          <div className="grid md:grid-cols-3 h-full">
            
            {/* Conversations List */}
            <div className="border-r border-slate-200 overflow-y-auto flex flex-col h-full">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                <p className="text-sm text-slate-600">{conversations.length} conversations</p>
              </div>

              <div className="divide-y divide-slate-200">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 cursor-pointer hover:bg-sky-50 transition ${
                      selectedConversation === conv.id ? 'bg-sky-50 border-l-4 border-sky-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white font-bold">
                          {conv.otherUser.avatar}
                        </div>
                        {conv.otherUser.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 truncate">{conv.otherUser.name}</h3>
                          <span className="text-xs text-slate-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                      </div>

                      {conv.unread > 0 && (
                        <div className="flex-shrink-0 w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation View */}
            <div className="md:col-span-2 flex flex-col h-full overflow-hidden">
              {selectedConv ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white font-bold">
                            {selectedConv.otherUser.avatar}
                          </div>
                          {selectedConv.otherUser.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{selectedConv.otherUser.name}</h3>
                          <p className="text-xs text-slate-600">
                            {selectedConv.otherUser.online ? 'Active now' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/pro/${selectedConv.id}`)}
                        className="px-4 py-2 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition text-sm font-medium"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              msg.senderId === 'me'
                                ? 'bg-sky-600 text-white'
                                : 'bg-white border-2 border-slate-200 text-slate-900'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                          </div>
                          <p className={`text-xs text-slate-500 mt-1 ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    {/* Scroll target */}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8 overflow-hidden">
                  <div>
                    <span className="text-6xl mb-4 block">💬</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Select a conversation</h3>
                    <p className="text-slate-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}