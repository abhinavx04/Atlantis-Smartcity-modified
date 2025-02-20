import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import { Socket, io } from 'socket.io-client';
import { auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: number;
}

export const CommunityChannel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email?.split('@')[0] || 'Anonymous';
        setCurrentUser(displayName);
      } else {
        navigate('/login');
      }
    });

    socketRef.current = io('http://localhost:3001'); // Change this to match the server
    
    socketRef.current.on('messages', (messages: Message[]) => {
      setMessages(messages);
      scrollToBottom();
    });

    return () => {
      unsubscribe();
      socketRef.current?.disconnect();
    };
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    socketRef.current?.emit('message', {
      content: newMessage,
      author: currentUser,
      timestamp: Date.now()
    });

    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      </div>

      <Navbar currentUser={currentUser} />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4" 
            style={{ 
              fontFamily: 'Syncopate, sans-serif',
              textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }}
          >
            COMMUNITY CHANNEL
          </h1>
          <p className="text-xl md:text-2xl text-blue-400 font-light tracking-wide">
            Connect with fellow citizens
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <div className="h-[500px] overflow-y-auto mb-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-600">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.author === currentUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.author === currentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] ${
                      msg.author === currentUser ? 'bg-blue-600/20' : 'bg-gray-800/50'
                    } rounded-lg p-4 backdrop-blur-sm border ${
                      msg.author === currentUser ? 'border-blue-500/30' : 'border-gray-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${
                        msg.author === currentUser ? 'text-blue-400' : 'text-gray-300'
                      }`}>
                        {msg.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-lg border border-gray-700/50 mr-4"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-blue-600 text-white rounded-lg border border-blue-500/30"
              >
                Send
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};