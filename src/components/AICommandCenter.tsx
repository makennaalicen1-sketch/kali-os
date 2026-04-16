import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Maximize2, Minimize2, Terminal, Sparkles, Loader2, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSecurityAdvice } from '../services/gemini';

interface AICommandCenterProps {
  onCommand: (cmd: string, args: any) => void;
  activeTab: string;
}

export default function AICommandCenter({ onCommand, activeTab }: AICommandCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const result = await getSecurityAdvice(userMsg, history);
    
    setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
    
    if (result.functionCalls) {
      result.functionCalls.forEach((call: any) => {
        onCommand(call.name, call.args);
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-96 h-[500px] bg-[#0c0c0d] border border-[#2d2d35] rounded-xl shadow-2xl shadow-[#9333ea]/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#2d2d35] bg-[#141417]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#9333ea]/20 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-[#9333ea]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9333ea]">AI Command Center</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-[#1c1c21] rounded text-[#9ca3af]">
                  <Minimize2 className="w-3 h-3" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-[#1c1c21] rounded text-[#9ca3af]">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-technical-grid">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 opacity-40">
                  <Command className="w-12 h-12 text-[#9333ea]" />
                  <p className="text-xs terminal-text">
                    System Integrated AI Ready.<br/>
                    Execute commands like:<br/>
                    "Switch to network monitor"
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`max-w-[85%] p-2.5 rounded-lg text-xs leading-relaxed ${
                    msg.role === 'assistant' 
                      ? 'bg-[#1c1c21] border border-[#2d2d35] text-[#f3f4f6]' 
                      : 'bg-[#9333ea] text-white font-bold'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="bg-[#1c1c21] border border-[#2d2d35] p-2.5 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-[#9333ea]" />
                    <span className="text-[10px] terminal-text text-[#9ca3af]">Processing command...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#2d2d35] bg-[#141417]/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter AI command..."
                  className="w-full bg-black border border-[#2d2d35] rounded px-3 py-2 pr-10 text-xs focus:border-[#9333ea] outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-[#9333ea] hover:bg-[#9333ea]/10 rounded transition-colors disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen && !isMinimized ? 'bg-[#9333ea] text-white' : 'bg-[#0c0c0d] border-2 border-[#9333ea] text-[#9333ea]'
        }`}
      >
        {isOpen && !isMinimized ? <Sparkles className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
