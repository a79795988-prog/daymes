'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bot, X, Trash2, Send, Sparkles, User, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateMedicines: () => void;
  onNavigateReorder: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onToggle,
  onNavigateMedicines,
  onNavigateReorder,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your DAYMES Healthcare Assistant 🩺. How can I assist you today? You can ask about medicines, refill your prescriptions, check order status, or get health guidance.',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const generateBotResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('amoxicillin')) {
      return 'Amoxicillin 500mg is a broad-spectrum penicillin antibiotic prescribed for bacterial infections. Recommended dosage is 1 capsule three times daily every 8 hours with plenty of water. A doctor prescription (Rx) is required.';
    }
    if (q.includes('atorvastatin') || q.includes('cholesterol') || q.includes('lipitor')) {
      return 'Atorvastatin 20mg (Lipitor) lowers LDL cholesterol and reduces cardiac risks. It is taken once daily in the evening, with or without food. Avoid grapefruit while on statin therapy.';
    }
    if (q.includes('metformin') || q.includes('diabetes')) {
      return 'Metformin HCl 500mg is used for type 2 diabetes management. To avoid stomach upset, take it with morning and evening meals.';
    }
    if (q.includes('ibuprofen') || q.includes('pain') || q.includes('headache')) {
      return 'Ibuprofen 400mg is an over-the-counter NSAID for pain and fever relief. Take 1 tablet every 4–6 hours after food. Do not exceed 3 tablets in 24 hours.';
    }
    if (q.includes('reorder') || q.includes('refill')) {
      return 'You can easily reorder routine medications in our Smart Reorder section. Prescriptions with active doctor approval can be refilled in 1 click!';
    }
    if (q.includes('order') || q.includes('status') || q.includes('track')) {
      return 'Orders are packed with temperature-controlled packaging and dispatch within 24 hours. You can view real-time delivery tracking in your "My Orders" tab.';
    }
    if (q.includes('emergency') || q.includes('urgent') || q.includes('hospital')) {
      return '🚨 For medical emergencies, call 911 or 112 immediately. You can also click the Emergency ER button on our platform to find the nearest 24/7 trauma centers.';
    }
    if (q.includes('find') || q.includes('search') || q.includes('medicine')) {
      return 'You can browse our complete pharmaceutical inventory in the "Medicines" tab, filter by therapeutic category, or search directly from the header.';
    }
    return `Thank you for your question about "${query}". DAYMES offers genuine pharmacy delivery, prescription verification, and doctor teleconsultations. Let me know if you would like me to guide you to our Medicines catalog or Smart Reorder portal!`;
  };

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReplyText = generateBotResponse(messageText);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-cleared',
        sender: 'bot',
        text: 'Chat history cleared. How can I assist you next? 🩺',
        time: 'Just now',
      },
    ]);
  };

  const quickPrompts = [
    '🔎 Find a Medicine',
    '💊 Medicine Information',
    '🔄 Reorder Medicine',
    '📋 My Orders',
    '🩺 Healthcare Guidance',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col mb-4 animate-in slide-in-from-bottom-5 duration-200" style={{ height: '520px' }}>
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-700 to-teal-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center font-bold border border-white/20">
                <Bot className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <h4 className="text-xs font-black leading-tight flex items-center gap-1.5">
                  <span>DAYMES Assistant</span>
                  <Sparkles className="w-3 h-3 text-teal-200" />
                </h4>
                <span className="text-[10px] text-teal-100 flex items-center gap-1 mt-0.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online Healthcare AI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-teal-100">
              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 text-[10px] text-slate-300 text-center font-medium leading-tight">
            DAYMES Assistant provides verified health & pharmacy information. For emergency diagnosis, always consult a certified physician.
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[9px] text-slate-400 text-right mt-1 opacity-70">
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 p-2 rounded-xl w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>DAYMES Assistant is typing…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-slate-800/90 border border-slate-700 text-slate-200 rounded-full text-[10px] font-semibold whitespace-nowrap hover:bg-sky-500 hover:text-slate-950 transition-all flex items-center gap-1 shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about medicines or refills..."
              className="flex-1 px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={onToggle}
        className="group relative px-4 py-3 bg-gradient-to-r from-sky-500 via-teal-400 to-sky-500 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 border border-sky-300/40"
      >
        <MessageSquare className="w-4 h-4 fill-slate-950" />
        <span className="text-xs tracking-tight">DAYMES Assistant</span>
        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping absolute -top-0.5 -right-0.5" />
      </button>
    </div>
  );
};
