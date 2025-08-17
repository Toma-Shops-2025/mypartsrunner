import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
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
  Navigation
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
          senderId: 'system',
          senderName: 'MyPartsRunner',
          senderRole: 'customer',
          content: `Chat started for delivery #${deliveryId}`,
          timestamp: Date.now() - 1800000, // 30 minutes ago
          type: 'system',
          deliveryId,
          status: 'delivered'
        },
        {
          id: '2',
          senderId: otherParticipant.id,
          senderName: otherParticipant.name,
          senderRole: otherParticipant.role,
          content: otherParticipant.role === 'customer' 
            ? 'Hi! I\'m excited for my auto parts delivery. Will you call when you arrive?'
            : 'Hello! I\'m your driver for today. I\'ll keep you updated on my progress.',
          timestamp: Date.now() - 1500000, // 25 minutes ago
          type: 'text',
          deliveryId,
          status: 'read'
        },
        {
          id: '3',
          senderId: user?.id || 'current-user',
          senderName: user?.firstName || 'You',
          senderRole: user?.role as 'customer' | 'driver' || 'customer',
          content: otherParticipant.role === 'customer'
            ? 'Absolutely! I\'ll call when I\'m outside. Should be there in about 15 minutes.'
            : 'Perfect! I\'ll be waiting. The building entrance is on the north side.',
          timestamp: Date.now() - 1200000, // 20 minutes ago
          type: 'text',
          deliveryId,
          status: 'read'
        }
      ];
      
      setMessages(mockMessages);
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setIsConnected(false);
    }
  }, [deliveryId, otherParticipant, user]);

  // Send message
  const sendMessage = useCallback(async (content: string, type: Message['type'] = 'text', attachments?: Message['attachments']) => {
    if (!content.trim() && !attachments?.length) return;

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: user?.id || 'current-user',
      senderName: user?.firstName || 'You',
      senderRole: user?.role as 'customer' | 'driver' || 'customer',
      content: content.trim(),
      timestamp: Date.now(),
      type,
      deliveryId,
      status: 'sending',
      attachments
    };

    // Add message optimistically
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      // In production, send via WebSocket or API
      // await fetch('/api/messages', { method: 'POST', body: JSON.stringify(message) });
      
      // Mock successful send
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mark message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'sent' } : msg
      ));
    }
  }, [user, deliveryId]);

  // Handle typing indicators
  const handleTyping = useCallback(() => {
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, []);

  // Send location
  const sendLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('Location not supported on this device');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendMessage(
          `📍 Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          'location',
          [{
            type: 'location',
            url: `https://maps.google.com/?q=${latitude},${longitude}`,
            coordinates: { lat: latitude, lng: longitude }
          }]
        );
      },
      (error) => {
        console.error('Location error:', error);
        alert('Failed to get location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [sendMessage]);

  // Send photo
  const sendPhoto = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        sendMessage(
          '📷 Photo',
          'image',
          [{
            type: 'image',
            url: dataUrl,
            thumbnail: dataUrl
          }]
        );
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }, [sendMessage]);

  // Quick actions for drivers/customers
  const quickActions = user?.role === 'driver' ? [
    { text: "I'm on my way!", icon: Car },
    { text: "Arrived at pickup location", icon: Package },
    { text: "Package picked up, heading to you now", icon: Navigation },
    { text: "I'm outside! 🚗", icon: MapPin },
    { text: "Package delivered! Thanks!", icon: CheckCheck }
  ] : [
    { text: "Thank you for the update!", icon: CheckCheck },
    { text: "I'll be waiting outside", icon: MapPin },
    { text: "Please call when you arrive", icon: Phone },
    { text: "No rush, take your time", icon: Clock },
    { text: "Great service, thanks!", icon: CheckCheck }
  ];

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [initializeWebSocket]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Simulate other user typing occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every 2 seconds
        setOtherUserTyping(true);
        setTimeout(() => setOtherUserTyping(false), 2000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending': return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-green-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-50">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarContent>
              {otherParticipant.role === 'driver' ? '🚗' : '👤'}
            </AvatarContent>
            <AvatarFallback>
              {otherParticipant.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherParticipant.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="secondary" className="text-xs">
                {otherParticipant.role === 'driver' ? '🚗 Driver' : '📦 Customer'}
              </Badge>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {otherParticipant.phone && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`tel:${otherParticipant.phone}`)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* Delivery Context */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Delivery #{deliveryContext.id}</span>
            <Badge className={
              deliveryContext.status === 'delivered' ? 'bg-green-500' :
              deliveryContext.status === 'in_transit' ? 'bg-blue-500' :
              deliveryContext.status === 'pickup' ? 'bg-orange-500' : 'bg-gray-500'
            }>
              {deliveryContext.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="text-gray-600 text-xs">
            ETA: {deliveryContext.estimatedTime} • {deliveryContext.deliveryAddress}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === user?.id || message.senderId === 'current-user';
          const isSystemMessage = message.type === 'system';
          
          if (isSystemMessage) {
            return (
              <div key={message.id} className="text-center">
                <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                  {message.content}
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                {!isOwnMessage && (
                  <div className="text-xs text-gray-500 mb-1 px-3">
                    {message.senderName}
                  </div>
                )}
                
                <div className={`rounded-2xl px-4 py-2 ${
                  isOwnMessage 
                    ? 'bg-blue-500 text-white rounded-br-md' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                  {message.type === 'text' && (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  {message.type === 'image' && message.attachments && (
                    <div>
                      {message.content && <p className="text-sm mb-2">{message.content}</p>}
                      {message.attachments.map((attachment, idx) => (
                        <img
                          key={idx}
                          src={attachment.thumbnail || attachment.url}
                          alt="Shared photo"
                          className="max-w-full h-auto rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  {message.type === 'location' && message.attachments && (
                    <div>
                      <p className="text-sm mb-2">{message.content}</p>
                      {message.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm underline"
                        >
                          <MapPin className="h-4 w-4" />
                          View on Map
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center gap-1 mt-1 px-3 ${
                  isOwnMessage ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {isOwnMessage && getMessageStatusIcon(message.status)}
                </div>
              </div>
            </div>
          );
        })}
        
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.slice(0, 3).map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap flex-shrink-0"
              onClick={() => sendMessage(action.text)}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={sendPhoto}
            disabled={!isConnected}
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={sendLocation}
            disabled={!isConnected}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1"
          />
          
          <Button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {!isConnected && (
          <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
            <AlertTriangle className="h-3 w-3" />
            <span>Connection lost. Messages will be sent when reconnected.</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default RealTimeMessaging; 