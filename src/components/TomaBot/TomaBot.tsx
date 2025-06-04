import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './TomaBot.css';
import { supabase } from '../../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Suggestion {
  text: string;
  action: string;
  icon: string;
}

const SYSTEM_PROMPT = `You are TomaBot, the official AI assistant for TomaShops, a video-first marketplace. You are friendly, helpful, and knowledgeable about all aspects of the platform.

Your core responsibilities include:

SELLER ASSISTANCE:
1. Video Listing Creation
   - Guide users on creating compelling video content
   - Suggest optimal video length, lighting, and angles
   - Help with product descriptions and pricing strategies
   - Recommend categories and tags for better visibility

2. Seller Best Practices
   - Shipping tips and packaging recommendations
   - Pricing strategies and market research
   - Customer service excellence tips
   - Inventory management advice`;

// Smart suggestions based on user context and common needs
const getSuggestions = (pathname: string): Suggestion[] => {
  const commonSuggestions: Suggestion[] = [
    { text: 'Create Listing', action: 'How do I create an effective video listing?', icon: '📹' },
    { text: 'Find Items', action: 'I need help finding specific items', icon: '🔍' },
    { text: 'Safety Tips', action: 'What are the safety guidelines?', icon: '🛡️' }
  ];

  const pageSuggestions: Record<string, Suggestion[]> = {
    '/sell': [
      { text: 'Video Tips', action: 'What makes a good product video?', icon: '🎥' },
      { text: 'Set Price', action: 'How should I price my item?', icon: '💰' },
      { text: 'Shipping', action: 'How do I handle shipping?', icon: '📦' }
    ],
    '/product': [
      { text: 'Buy Now', action: 'How do I purchase this item?', icon: '🛒' },
      { text: 'Payment', action: 'What payment methods are accepted?', icon: '💳' },
      { text: 'Shipping', action: 'What are the shipping options?', icon: '🚚' }
    ],
    '/cart': [
      { text: 'Checkout', action: 'Guide me through checkout', icon: '✨' },
      { text: 'Payment', action: 'What payment methods can I use?', icon: '💳' },
      { text: 'Security', action: 'Is my payment secure?', icon: '🔒' }
    ],
    '/profile': [
      { text: 'Settings', action: 'How do I update my profile?', icon: '⚙️' },
      { text: 'Orders', action: 'Where can I see my orders?', icon: '📋' },
      { text: 'Security', action: 'How do I secure my account?', icon: '🔐' }
    ]
  };

  // Find matching page suggestions or use common ones
  const matchingPath = Object.keys(pageSuggestions).find(path => pathname.includes(path));
  return matchingPath ? pageSuggestions[matchingPath] : commonSuggestions;
};

const TomaBot: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryKey = 'tomaBotChatHistory';
  const speechRecognition = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = 'en-US';

      speechRecognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSubmit(new Event('submit') as any);
      };

      speechRecognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      speechRecognition.current.onend = () => {
        setIsListening(false);
      };

      setVoiceEnabled(true);
    }
  }, []);

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (!speechRecognition.current) return;

    if (isListening) {
      speechRecognition.current.stop();
    } else {
      setInputMessage('');
      speechRecognition.current.start();
      setIsListening(true);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Load chat history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(chatHistoryKey);
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as Message[];
      // Only load messages from the last 24 hours
      const recentMessages = parsedHistory.filter(
        msg => Date.now() - msg.timestamp < 24 * 60 * 60 * 1000
      );
      if (recentMessages.length > 0) {
        setMessages(recentMessages);
      } else {
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, []);

  // Update suggestions when location changes
  useEffect(() => {
    setSuggestions(getSuggestions(location.pathname));
  }, [location.pathname]);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
    }
  }, [messages]);

  // Add environment testing
  useEffect(() => {
    const testEnvironment = async () => {
      try {
        console.log('Testing environment configuration...');
        
        // Test Supabase connection only
        const { data: products, error: supabaseError } = await supabase
          .from('products')
          .select('count', { count: 'exact' });
          
        if (supabaseError) {
          console.error('Supabase test failed:', supabaseError);
        } else {
          console.log('Supabase connection successful:', { count: products });
        }

        // Verify OpenAI API key format
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
          console.error('OpenAI API key is missing');
        } else if (!apiKey.startsWith('sk-')) {
          console.error('OpenAI API key appears to be invalid (should start with "sk-")');
        } else {
          console.log('OpenAI API key format appears valid');
        }
      } catch (error) {
        console.error('Environment test failed:', error);
      }
    };

    testEnvironment();
  }, []);

  // Check configuration on mount
  useEffect(() => {
    const checkConfiguration = () => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || !apiKey.startsWith('sk-')) {
        console.warn('OpenAI API key is not properly configured');
        setIsConfigured(false);
        setMessages([{
          role: 'assistant',
          content: "I'm currently in maintenance mode. Please try again later or contact support for assistance.",
          timestamp: Date.now()
        }]);
        return false;
      }
      setIsConfigured(true);
      return true;
    };

    checkConfiguration();
  }, []);

  const initializeChat = () => {
    const welcomeMessage = getContextMessage(location.pathname);
    setMessages([{
      role: 'assistant',
      content: welcomeMessage,
      timestamp: Date.now()
    }]);
  };

  const getContextMessage = (pathname: string): string => {
    if (pathname === '/sell') {
      return "Hi! I see you're interested in selling. I can help you create an effective listing and guide you through the selling process. What would you like to know?";
    } else if (pathname.includes('/product')) {
      return "Hi! I can help you learn more about this product or guide you through the purchase process. What would you like to know?";
    } else if (pathname === '/cart' || pathname === '/checkout') {
      return "Hi! Need help with your purchase? I can guide you through the checkout process or answer any questions you have.";
    } else if (pathname === '/profile') {
      return "Hi! I can help you manage your profile, track orders, or optimize your listings. What would you like to know?";
    }
    return "Hi! I'm TomaBot, your personal assistant for TomaShops. How can I help you today?";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !isConfigured) return;

    const userMessage = {
      role: 'user' as const,
      content: inputMessage.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey || !apiKey.startsWith('sk-')) {
        throw new Error('API_NOT_CONFIGURED');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage.content }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        if (response.status === 429) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        } else if (errorData.error?.code === 'insufficient_quota') {
          throw new Error('QUOTA_EXCEEDED');
        }
        
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response received');
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (isSpeaking) {
        speak(assistantMessage.content);
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      if (error instanceof Error) {
        switch (error.message) {
          case 'API_NOT_CONFIGURED':
            errorMessage = "I'm currently unavailable due to configuration issues. Please contact support.";
            setIsConfigured(false);
            break;
          case 'RATE_LIMIT_EXCEEDED':
            errorMessage = "I'm receiving too many requests right now. Please wait a moment and try again.";
            break;
          case 'QUOTA_EXCEEDED':
            errorMessage = "I've reached my usage limit for now. Please try again later.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (action: string) => {
    setInputMessage(action);
    handleSubmit(new Event('submit') as any);
  };

  const clearHistory = () => {
    localStorage.removeItem(chatHistoryKey);
    initializeChat();
  };

  return (
    <div className={`tomabot-container ${isOpen ? 'open' : ''}`}>
      <button 
        className="tomabot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      <div className="tomabot-chat">
        <div className="tomabot-header">
          <div className="header-main">
            <h3>TomaBot Assistant</h3>
            <div className="header-controls">
              {voiceEnabled && (
                <>
                  <button
                    className={`voice-control ${isListening ? 'active' : ''}`}
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? '🎤' : '🎤'}
                  </button>
                  <button
                    className={`voice-control ${isSpeaking ? 'active' : ''}`}
                    onClick={stopSpeaking}
                    title={isSpeaking ? 'Stop speaking' : 'Voice output enabled'}
                  >
                    {isSpeaking ? '🔊' : '🔈'}
                  </button>
                </>
              )}
              <button 
                className="clear-history" 
                onClick={clearHistory}
                title="Clear chat history"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div className="suggestions-container">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-button"
              onClick={() => handleSuggestionClick(suggestion.action)}
              disabled={isLoading}
            >
              <span className="suggestion-icon">{suggestion.icon}</span>
              {suggestion.text}
            </button>
          ))}
        </div>

        <div className="tomabot-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'assistant' ? 'assistant' : 'user'}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="tomabot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Type your message...'}
            disabled={isLoading || isListening}
          />
          <button 
            type="submit" 
            disabled={isLoading || isListening}
            title={isListening ? 'Listening...' : 'Send message'}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default TomaBot; 