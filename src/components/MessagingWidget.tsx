import React, { useState, useEffect } from 'react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import RealTimeMessaging from './RealTimeMessaging';
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2,
  Phone,
  Clock,
  User,
  Car
} from 'lucide-react';

interface MessagingWidgetProps {
  className?: string;
}

const MessagingWidget: React.FC<MessagingWidgetProps> = ({ className = '' }) => {
  const { user } = useAppContext();
  const { 
    conversations, 
    totalUnreadCount, 
    activeConversation, 
    setActiveConversation,
    markAsRead,
    isConnected 
  } = useMessaging();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Auto-open when new messages arrive
  useEffect(() => {
    if (totalUnreadCount > 0 && !isOpen) {
      // Auto-open widget for new messages (with delay for user experience)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [totalUnreadCount, isOpen]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    markAsRead(conversationId);
    setIsMinimized(false);
  };

  // Get other participant in conversation
  const getOtherParticipant = (conversation: any) => {
    if (!user) return null;
    
    const isCustomer = user.role === 'customer';
    const otherParticipant = isCustomer 
      ? conversation.participants.driver 
      : conversation.participants.customer;
    
    return {
      ...otherParticipant,
      role: isCustomer ? 'driver' : 'customer'
    };
  };

  // Format last message time
  const formatLastMessageTime = (timestamp: number) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Don't render if user is not authenticated
  if (!user) return null;

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div
          className={`fixed z-50 ${className}`}
          style={{ 
            bottom: '20px', 
            right: '20px',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 relative"
            style={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              transform: totalUnreadCount > 0 ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <MessageSquare className="h-6 w-6" />
            {totalUnreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white text-xs flex items-center justify-center animate-pulse"
              >
                {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Main Widget */}
      {isOpen && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-2xl border"
          style={{
            width: isMinimized ? '320px' : '400px',
            height: isMinimized ? '60px' : activeConversation ? '600px' : '450px',
            bottom: position.y,
            right: position.x,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-3 bg-blue-50 rounded-t-lg border-b cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Messages</h3>
              {totalUnreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {totalUnreadCount}
                </Badge>
              )}
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setActiveConversation(null);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Active Conversation */}
              {activeConversation && (() => {
                const conversation = conversations.find(c => c.id === activeConversation);
                const otherParticipant = conversation ? getOtherParticipant(conversation) : null;
                
                return conversation && otherParticipant ? (
                  <div className="h-full flex flex-col">
                    <div className="p-2 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveConversation(null)}
                        className="mb-2"
                      >
                        ← Back to Conversations
                      </Button>
                    </div>
                    <div className="flex-1">
                      <RealTimeMessaging
                        deliveryId={conversation.deliveryId}
                        otherParticipant={otherParticipant}
                        onClose={() => setActiveConversation(null)}
                      />
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Conversations List */}
              {!activeConversation && (
                <div className="flex flex-col h-full">
                  {conversations.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-8 text-center">
                      <div>
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
                        <p className="text-sm text-gray-600">
                          Your delivery conversations will appear here
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto">
                      {conversations
                        .sort((a, b) => b.lastActivity - a.lastActivity)
                        .map((conversation) => {
                          const otherParticipant = getOtherParticipant(conversation);
                          if (!otherParticipant) return null;

                          return (
                            <div
                              key={conversation.id}
                              className="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => handleSelectConversation(conversation.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                      {otherParticipant.role === 'driver' ? '🚗' : '👤'}
                                    </AvatarFallback>
                                  </Avatar>
                                  {conversation.unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">
                                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-medium text-sm truncate">
                                      {otherParticipant.name}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                      {otherParticipant.role === 'driver' ? (
                                        <Car className="h-3 w-3 text-blue-500" />
                                      ) : (
                                        <User className="h-3 w-3 text-green-500" />
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {formatLastMessageTime(conversation.lastActivity)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 truncate">
                                      {conversation.lastMessage?.type === 'image' ? '📷 Photo' :
                                       conversation.lastMessage?.type === 'location' ? '📍 Location' :
                                       conversation.lastMessage?.content || 'No messages yet'}
                                    </p>
                                    <Badge variant="outline" className="text-xs">
                                      #{conversation.deliveryId}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="p-3 border-t bg-gray-50">
                    <div className="text-xs text-gray-600 text-center">
                      {isConnected ? (
                        <span className="flex items-center justify-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Connected • Real-time messaging
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          Connecting...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MessagingWidget; 