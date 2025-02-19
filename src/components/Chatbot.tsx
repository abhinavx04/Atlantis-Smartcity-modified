import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getAIResponse } from '../services/gemini';

interface Message {
  text: string;
  isUser: boolean;
  id: string;
}

interface TypeWriterProps {
  text: string;
  speed?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className="relative">
      {displayedText}
      {isTyping && (
        <span className="animate-pulse ml-1 inline-block">▋</span>
      )}
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // FAQ database
  const faqs = {
    "what is dwarka": `Dwarka is a revolutionary smart city management platform that enhances citizen-municipal connectivity through digital integration. It provides a secure web-based portal for accessing city services, submitting complaints, and interacting with administrators.`,
    
    "main features": `Dwarka offers several key features:
    • Authenticated access via Aadhar card
    • City-wide announcements and updates
    • Complaint submission and tracking
    • Public facility reservations
    • Direct communication with administrators
    • Emergency services access
    • Community engagement tools`,

    "emergency services": `Our emergency services include:
    • 24/7 Ambulance dispatch system
    • Quick police response
    • Emergency doctor appointments
    • SOS alert system
    • Real-time emergency tracking`,

    "safety features": `Dwarka prioritizes safety with:
    • Women's safety SOS system
    • AI-driven emergency detection
    • Live location tracking
    • Quick police dispatch
    • Emergency contact alerts
    • 24/7 helpline access`,

    "waste management": `Our waste management system includes:
    • Food waste reduction program
    • Surplus food distribution
    • Real-time waste tracking
    • Volunteer coordination
    • Smart bin monitoring
    • Recycling programs`,

    "transportation": `Transportation services offer:
    • Car rental services
    • Live bus/metro tracking
    • Smart parking system
    • Traffic updates
    • Route optimization
    • Bike-sharing network`,

    "healthcare": `Healthcare services include:
    • Online doctor appointments
    • Ambulance dispatch system
    • Hospital coordination
    • Patient status tracking
    • Emergency response
    • Medical facility locator`,

    "police services": `Police services feature:
    • Online crime reporting
    • Real-time incident tracking
    • Case status monitoring
    • Emergency response
    • Community safety alerts
    • Direct police communication`,

    "community features": `Community services include:
    • Local news updates
    • Weather alerts
    • Community announcements
    • Event calendar
    • Public facility bookings
    • Citizen feedback system`,

    "how to access": `To access Dwarka:
    • Visit www.dwarka-smartcity.com
    • Register using your Aadhar card
    • Complete profile verification
    • Access services via web dashboard
    • Download mobile app for on-the-go access`,

    "technical features": `Technical capabilities include:
    • React + Vite web application
    • Firebase backend integration
    • Real-time tracking systems
    • AI-powered automation
    • Secure authentication
    • Cloud-based infrastructure`,

    "help": `I can help you with information about:
    • Main Platform Features
    • Emergency Services
    • Safety Systems
    • Waste Management
    • Transportation
    • Healthcare Services
    • Police Services
    • Community Features
    • Access Instructions
    • Technical Details

  What would you like to know about?`
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate unique ID for messages
  const generateId = () => Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "🙏 Hi! I'm Sudama, your AI Assistant. Type 'help' for more information.",
        isUser: false,
        id: generateId()
      }]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { 
      text: input, 
      isUser: true, 
      id: generateId() 
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    scrollToBottom(); // Scroll to bottom after adding user message

    // Add typing indicator
    const typingMessage: Message = {
      text: "▋",
      isUser: false,
      id: 'typing'
    };
    setMessages(prev => [...prev, typingMessage]);
    scrollToBottom(); // Scroll to bottom after adding typing indicator

    try {
      const response = await getAIResponse(input);
      // Remove typing indicator and add AI response
      setMessages(prev => 
        prev.filter(m => m.id !== 'typing').concat({
          text: response,
          isUser: false,
          id: generateId(),
        })
      );
      scrollToBottom(); // Scroll to bottom after adding AI response
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => 
        prev.filter(m => m.id !== 'typing').concat({
          text: "I'm having trouble right now. Please try again later.",
          isUser: false,
          id: generateId()
        })
      );
      scrollToBottom(); // Scroll to bottom after error message
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className={`bg-blue-600 text-white rounded-full p-4 shadow-lg 
          transition-all duration-300 hover:shadow-xl hover:scale-105 transform
          ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
          ${isAnimating ? 'pointer-events-none' : ''}`}
      >
        <MessageCircle size={24} className="animate-pulse" />
      </button>

      <div>
        {`absolute bottom-0 right-0 transition-all duration-300 transform
              ${isOpen 
              ? 'scale-100 opacity-100 animate-[slideInUp_0.3s_ease-out]' 
              : 'scale-95 opacity-0 pointer-events-none'}`}
        <div className="bg-gray-900 rounded-2xl shadow-2xl w-96 h-[32rem] flex flex-col backdrop-blur-sm border border-gray-800">
          {/* Header */}
          <div className="bg-gray-950 text-white p-6 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <h3 className="font-semibold text-lg animate-[fadeIn_0.3s_ease-out]">Sudama - Dwarka's Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="hover:bg-gray-800 p-2 rounded-full transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-900 scrollbar-thin scrollbar-thumb-blue-600">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end space-x-2 
                  animate-[typeIn_0.3s_ease-out] origin-bottom 
                  ${msg.isUser ? 'animate-[slideInRight_0.3s_ease-out]' : 'animate-[slideInLeft_0.3s_ease-out]'}`}
              >
                {!msg.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm 
                    animate-[popIn_0.3s_ease-out]">
                    S
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 relative 
                    ${msg.isUser 
                      ? 'bg-blue-600 text-white shadow-md rounded-br-none' 
                      : 'bg-gray-800 text-white rounded-bl-none'}
                    animate-[scaleIn_0.3s_ease-out]`}
                >
                  {msg.isUser ? (
                    msg.text
                  ) : (
                    <TypeWriter text={msg.text} speed={30} />
                  )}
                </div>
              </div>
            ))}
            
            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-6 bg-gray-900 rounded-b-2xl">
            <div className="flex space-x-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Sudama about Dwarka..."
                className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-full px-6 py-3 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all duration-300 hover:border-blue-300
                  animate-[slideInUp_0.3s_ease-out]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`bg-blue-600 text-white rounded-full p-3 
                  hover:shadow-lg transition-all duration-200 hover:scale-110 transform
                  disabled:opacity-50 disabled:cursor-not-allowed
                  group flex items-center justify-center
                  animate-[slideInRight_0.3s_ease-out]`}
              >
                <Send 
                  size={20} 
                  className="group-hover:rotate-12 transition-transform duration-300" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;