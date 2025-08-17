import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAppContext } from './AppContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'driver' | 'admin';
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'location' | 'system';
  deliveryId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'location';
    url: string;
    thumbnail?: string;
    coordinates?: { lat: number; lng: number };
  }[];
}

interface Conversation {
  id: string;
  deliveryId: string;
  participants: {
    customer: { id: string; name: string; phone?: string };
    driver: { id: string; name: string; phone?: string };
  };
  lastMessage?: Message;
  unreadCount: number;
  lastActivity: number;
  status: 'active' | 'archived';
}

interface MessagingContextType {
  // State
  conversations: Conversation[];
  activeConversation: string | null;
  messages: { [conversationId: string]: Message[] };
  totalUnreadCount: number;
  isConnected: boolean;
  typingUsers: { [conversationId: string]: string[] };

  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string, type?: Message['type'], attachments?: Message['attachments']) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  startConversation: (deliveryId: string, otherParticipant: { id: string; name: string; role: 'customer' | 'driver'; phone?: string }) => string;
  
  // Real-time features
  setTyping: (conversationId: string, isTyping: boolean) => void;
  subscribeToDelivery: (deliveryId: string) => void;
  unsubscribeFromDelivery: (deliveryId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: string[] }>({});
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (!isAuthenticated || !user) return;

    try {
      // In production: const ws = new WebSocket(`wss://api.mypartsrunner.com/messaging?userId=${user.id}&role=${user.role}`);
      // For demo, simulate connection
      setIsConnected(true);
      
      // Load initial conversations and messages
      loadInitialData();
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setIsConnected(false);
    }
  }, [isAuthenticated, user]);

  // Load initial conversations and messages
  const loadInitialData = useCallback(() => {
    if (!user) return;

    // Mock conversations for demo
    const mockConversations: Conversation[] = [
      {
        id: 'conv_1',
        deliveryId: 'MP-2024-001',
        participants: {
          customer: { id: 'cust_1', name: 'Sarah Johnson', phone: '+1555123456' },
          driver: { id: 'driver_1', name: 'Demo Driver', phone: '+1555987654' }
        },
        unreadCount: user.role === 'customer' ? 1 : 0,
        lastActivity: Date.now() - 300000, // 5 minutes ago
        status: 'active'
      },
      {
        id: 'conv_2',
        deliveryId: 'MP-2024-002',
        participants: {
          customer: { id: 'cust_2', name: 'Mike Rodriguez', phone: '+1555234567' },
          driver: { id: 'driver_2', name: 'Demo Driver', phone: '+1555987654' }
        },
        unreadCount: 0,
        lastActivity: Date.now() - 900000, // 15 minutes ago
        status: 'active'
      }
    ];

    // Mock messages for demo
    const mockMessages: { [conversationId: string]: Message[] } = {
      conv_1: [
        {
          id: 'msg_1',
          senderId: user.role === 'customer' ? 'driver_1' : 'cust_1',
          senderName: user.role === 'customer' ? 'Demo Driver' : 'Sarah Johnson',
          senderRole: user.role === 'customer' ? 'driver' : 'customer',
          content: user.role === 'customer' 
            ? 'Hi! I\'m your driver for today. I\'ll be there in about 10 minutes!'
            : 'Great! I\'ll be waiting. Please call when you arrive.',
          timestamp: Date.now() - 300000,
          type: 'text',
          deliveryId: 'MP-2024-001',
          status: 'read'
        }
      ],
      conv_2: [
        {
          id: 'msg_2',
          senderId: user.role === 'customer' ? 'driver_2' : 'cust_2',
          senderName: user.role === 'customer' ? 'Demo Driver' : 'Mike Rodriguez',
          senderRole: user.role === 'customer' ? 'driver' : 'customer',
          content: user.role === 'customer'
            ? 'Package delivered successfully! Thanks for choosing MyPartsRunner!'
            : 'Perfect timing! Thanks for the quick delivery.',
          timestamp: Date.now() - 900000,
          type: 'text',
          deliveryId: 'MP-2024-002',
          status: 'read'
        }
      ]
    };

    // Update last messages
    const conversationsWithLastMessage = mockConversations.map(conv => ({
      ...conv,
      lastMessage: mockMessages[conv.id]?.[mockMessages[conv.id].length - 1]
    }));

    setConversations(conversationsWithLastMessage);
    setMessages(mockMessages);
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    attachments?: Message['attachments']
  ) => {
    if (!user || !content.trim() && !attachments?.length) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: user.id,
      senderName: user.firstName || user.name || 'You',
      senderRole: user.role as 'customer' | 'driver' | 'admin',
      content: content.trim(),
      timestamp: Date.now(),
      type,
      deliveryId: conversation.deliveryId,
      status: 'sending',
      attachments
    };

    // Add message optimistically
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message]
    }));

    // Update conversation last message and activity
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: message, lastActivity: Date.now() }
        : conv
    ));

    try {
      // In production: send via WebSocket or API
      // await fetch('/api/messages', { method: 'POST', body: JSON.stringify(message) });
      
      // Mock successful send
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [conversationId]: prev[conversationId]?.map(msg => 
            msg.id === message.id ? { ...msg, status: 'delivered' } : msg
          ) || []
        }));
      }, 1000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mark message as failed
      setMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId]?.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        ) || []
      }));
    }
  }, [user, conversations]);

  // Mark conversation as read
  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));

    // Mark messages as read
    setMessages(prev => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map(msg => 
        msg.senderId !== user?.id ? { ...msg, status: 'read' } : msg
      ) || []
    }));
  }, [user]);

  // Start new conversation
  const startConversation = useCallback((
    deliveryId: string,
    otherParticipant: { id: string; name: string; role: 'customer' | 'driver'; phone?: string }
  ): string => {
    if (!user) return '';

    // Check if conversation already exists
    const existingConv = conversations.find(c => c.deliveryId === deliveryId);
    if (existingConv) return existingConv.id;

    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newConversation: Conversation = {
      id: conversationId,
      deliveryId,
      participants: {
        customer: user.role === 'customer' 
          ? { id: user.id, name: user.firstName || user.name || 'You', phone: user.phone }
          : { id: otherParticipant.id, name: otherParticipant.name, phone: otherParticipant.phone },
        driver: user.role === 'driver'
          ? { id: user.id, name: user.firstName || user.name || 'You', phone: user.phone }
          : { id: otherParticipant.id, name: otherParticipant.name, phone: otherParticipant.phone }
      },
      unreadCount: 0,
      lastActivity: Date.now(),
      status: 'active'
    };

    setConversations(prev => [newConversation, ...prev]);
    setMessages(prev => ({ ...prev, [conversationId]: [] }));

    // Send initial system message
    const systemMessage: Message = {
      id: `sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'MyPartsRunner',
      senderRole: 'admin',
      content: `Chat started for delivery #${deliveryId}`,
      timestamp: Date.now(),
      type: 'system',
      deliveryId,
      status: 'delivered'
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [systemMessage]
    }));

    return conversationId;
  }, [user, conversations]);

  // Set typing indicator
  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (!user) return;

    setTypingUsers(prev => {
      const currentTyping = prev[conversationId] || [];
      if (isTyping) {
        return {
          ...prev,
          [conversationId]: [...currentTyping.filter(id => id !== user.id), user.id]
        };
      } else {
        return {
          ...prev,
          [conversationId]: currentTyping.filter(id => id !== user.id)
        };
      }
    });

    // Send typing indicator to server
    // In production: wsConnection?.send(JSON.stringify({ type: 'typing', conversationId, isTyping }));
  }, [user]);

  // Subscribe/unsubscribe to delivery updates
  const subscribeToDelivery = useCallback((deliveryId: string) => {
    // In production: wsConnection?.send(JSON.stringify({ type: 'subscribe', deliveryId }));
    console.log('Subscribed to delivery:', deliveryId);
  }, []);

  const unsubscribeFromDelivery = useCallback((deliveryId: string) => {
    // In production: wsConnection?.send(JSON.stringify({ type: 'unsubscribe', deliveryId }));
    console.log('Unsubscribed from delivery:', deliveryId);
  }, []);

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  // Initialize on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeWebSocket();
    }
  }, [isAuthenticated, user, initializeWebSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const value: MessagingContextType = {
    // State
    conversations,
    activeConversation,
    messages,
    totalUnreadCount,
    isConnected,
    typingUsers,

    // Actions
    setActiveConversation,
    sendMessage,
    markAsRead,
    startConversation,
    setTyping,
    subscribeToDelivery,
    unsubscribeFromDelivery
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export default MessagingProvider; 