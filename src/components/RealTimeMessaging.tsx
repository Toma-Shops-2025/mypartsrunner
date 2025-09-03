import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import BackButton from '@/components/ui/back-button';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  MapPin, 
  Camera, 
  Paperclip,
  Clock,
  CheckCheck,
  AlertTriangle,
  Car,
  Package,
  Navigation,
  ArrowLeft
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'driver';
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

interface DeliveryContext {
  id: string;
  customerName: string;
  driverName: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: 'assigned' | 'pickup' | 'in_transit' | 'delivered';
  estimatedTime: string;
}

interface RealTimeMessagingProps {
  deliveryId: string;
  otherParticipant: {
    id: string;
    name: string;
    role: 'customer' | 'driver';
    phone?: string;
  };
  onClose?: () => void;
}

const RealTimeMessaging: React.FC<RealTimeMessagingProps> = ({
  deliveryId,
  otherParticipant,
  onClose
}) => {
  const { user } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock delivery context
  const deliveryContext: DeliveryContext = {
    id: deliveryId,
    customerName: otherParticipant.role === 'customer' ? otherParticipant.name : 'Sarah Johnson',
    driverName: otherParticipant.role === 'driver' ? otherParticipant.name : 'Demo Driver',
    pickupAddress: '123 Main St, Downtown',
    deliveryAddress: '789 Oak Avenue, Uptown',
    status: 'in_transit',
    estimatedTime: '15 minutes'
  };

  // Initialize WebSocket connection (mock for demo)
  const initializeWebSocket = useCallback(() => {
    try {
      // In production, this would connect to your WebSocket server
      // wsRef.current = new WebSocket(`wss://api.mypartsrunner.com/messaging/${deliveryId}`);
      
      // Mock connection for demo
      setIsConnected(true);
      
      // Simulate existing messages
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'driver',
          senderName: 'Demo Driver',
          senderRole: 'driver',
          content: 'Hi! I\'m on my way to pick up your order. ETA 15 minutes.',
          timestamp: Date.now() - 300000, // 5 minutes ago
          type: 'text',
          deliveryId,
          status: 'delivered'
        },
        {
          id: '2',
          senderId: 'customer',
          senderName: 'You',
          senderRole: 'customer',
          content: 'Great! I\'ll be waiting at the front door.',
          timestamp: Date.now() - 180000, // 3 minutes ago
          type: 'text',
          deliveryId,
          status: 'delivered'
        }
      ];
      
      setMessages(mockMessages);
    } catch (err) {
      setError('Failed to connect to messaging service');
      console.error('WebSocket connection error:', err);
    }
  }, [deliveryId]);

  useEffect(() => {
    initializeWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [initializeWebSocket]);

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name || 'You',
      senderRole: user.role === 'driver' ? 'driver' : 'customer',
      content: newMessage.trim(),
      timestamp: Date.now(),
      type: 'text',
      deliveryId,
      status: 'sending'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }, 1000);
  };

  // Handle back button
  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-red-50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Connection Error</span>
          </div>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messaging Unavailable</h3>
            <p className="text-sm text-gray-600 mb-4">
              We're having trouble connecting to the messaging service.
            </p>
            <Button onClick={initializeWebSocket} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Back Button */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-1 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {otherParticipant.role === 'driver' ? '🚗' : '👤'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{otherParticipant.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{otherParticipant.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {deliveryContext.status.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-gray-500">
              ETA: {deliveryContext.estimatedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderRole === user?.role ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderRole === user?.role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {message.status === 'read' && (
                  <CheckCheck className="h-3 w-3" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <span className="text-sm">Typing</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMessaging; 