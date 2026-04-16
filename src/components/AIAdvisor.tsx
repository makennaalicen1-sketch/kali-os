import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, ShieldCheck, Info } from 'lucide-react';
import { getSecurityAdvice } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello. I am your CyberDefense Advisor. How can I help you secure your systems today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(false);
  };

  return (
    <div className="p-6 bg-[#1c1c21] border border-[#2d2d35] rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#9333ea]">
          <Bot className="w-5 h-5" />
          AI Security Advisor
        </h2>
        <div className="flex items-center gap-1 px-2 py-1 bg-[#9333ea]/10 border border-[#9333ea]/20 rounded text-[10px] text-[#9333ea] font-bold">
          <ShieldCheck className="w-3 h-3" />
          DEFENSE MODE
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-[#9333ea]/20 text-[#9333ea]' : 'bg-[#2d2d35] text-[#9ca3af]'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                msg.role === 'assistant' 
                  ? 'bg-black border border-[#2d2d35] text-[#f3f4f6]' 
                  : 'bg-[#9333ea] text-white font-medium'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#9333ea]/20 text-[#9333ea] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-black border border-[#2d2d35] p-3 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#9333ea]" />
              <span className="text-xs terminal-text text-[#9ca3af]">Analyzing security context...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about defensive security..."
          className="w-full bg-black border border-[#2d2d35] rounded px-4 py-3 pr-12 focus:border-[#9333ea] outline-none transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#9333ea] hover:bg-[#9333ea]/10 rounded-full transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-4 flex items-start gap-2 p-2 bg-[#1c1c21]/50 rounded border border-[#2d2d35]">
        <Info className="w-3 h-3 text-[#9ca3af] mt-0.5" />
        <p className="text-[10px] text-[#9ca3af] leading-tight">
          The advisor is trained on defensive security frameworks (NIST, MITRE ATT&CK). It will not provide information on how to conduct attacks.
        </p>
      </div>
    </div>
  );
}
