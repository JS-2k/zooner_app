import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Store } from 'lucide-react';
import type { HoldPass } from './HoldPassSheet';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'store';
  text: string;
  time: string;
}

interface DirectChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pass: HoldPass | null;
}

export const DirectChatDrawer: React.FC<DirectChatDrawerProps> = ({
  isOpen,
  onClose,
  pass,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or load conversation for this hold
  useEffect(() => {
    if (!pass) return;

    // Check localStorage for existing messages for this hold pass
    const storageKey = `zooner_chat_${pass.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch {
        // Fallback to initial message
      }
    }

    const initialMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'store',
        text: `Hello ${pass.customerName || 'there'}! We have reserved "${pass.productName}" at our counter under pass #${pass.passCode}. See you soon!`,
        time: new Date(pass.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(initialMessages);
    localStorage.setItem(storageKey, JSON.stringify(initialMessages));
  }, [pass]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!pass) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInputText('');

    const storageKey = `zooner_chat_${pass.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Simulated quick store clerk response after 1.5s if it's an inquiry
    if (text.toLowerCase().includes('eta') || text.toLowerCase().includes('way') || text.toLowerCase().includes('late')) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'store',
          text: 'Acknowledged! Your reservation is securely held at the billing counter. Take your time.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => {
          const next = [...prev, replyMsg];
          localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      }, 1500);
    }
  };

  const quickChips = [
    'On my way! ETA 10 mins',
    'Which counter is the item at?',
    'Running 5 mins late, please hold'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-lg bg-[#07080B] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl h-[88vh] sm:h-[680px] flex flex-col text-left selection:bg-white selection:text-black overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#07080B]/95 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                  <Store className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <span>{pass.storeName}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Store Desk Active</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Context bar */}
            <div className="px-6 py-2 bg-white/[0.02] border-b border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between shrink-0">
              <span className="truncate max-w-[240px]">Hold: {pass.productName}</span>
              <span className="text-emerald-400 font-bold">Pass #{pass.passCode}</span>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isMe = m.sender === 'customer';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-white text-slate-950 font-medium rounded-2xl rounded-tr-xs'
                          : 'bg-white/5 text-slate-200 border border-white/10 rounded-2xl rounded-tl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                      {m.time}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1 rounded-full border border-white/10 hover:border-white/30 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 border-t border-white/10 bg-[#07080B] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type message to counter clerk..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-white/30 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="h-9 w-9 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
