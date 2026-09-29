'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bot, X, Trash2, Send, Sparkles, User, ShoppingBag, Plus, Stethoscope } from 'lucide-react';
import { MedicineItem, MEDICINES } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface SuggestedMed {
  id: string;
  name: string;
  dosage: string;
  price: number;
  requiresRx: boolean;
  reason: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  suggestedMedicines?: SuggestedMed[];
}

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateMedicines: () => void;
  onNavigateReorder: () => void;
  onAddToCart: (medicine: MedicineItem) => void;
  onOpenDoctor: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onToggle,
  onNavigateMedicines,
  onNavigateReorder,
  onAddToCart,
  onOpenDoctor,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your DAYMES Healthcare AI Assistant 🩺.\n\nTell me your illness or symptoms (e.g., "I have fever", "headache", "cold & cough"), and I will suggest the appropriate verified medicines, correct adult dosages, and health precautions.',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([
    'I have fever',
    'Medicine for headache',
    'Allergy & cold',
    'Cough & sore throat',
    'Smart Reorder',
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    if (messageText.includes('Doctor Consult')) {
      onOpenDoctor();
      return;
    }

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: data.text || 'Here is what I found for your health inquiry.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedMedicines: data.suggestedMedicines || [],
        };
        setMessages((prev) => [...prev, botMsg]);
        if (data.quickPrompts && data.quickPrompts.length > 0) {
          setQuickPrompts(data.quickPrompts);
        }
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Fallback response
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: 'For fever, **Paracetamol 500mg** is the recommended first-line antipyretic medicine. Take 1 tablet every 4–6 hours as needed with water. Rest and stay hydrated.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedMedicines: [
          {
            id: 'med-000',
            name: 'Paracetamol 500mg',
            dosage: '500mg Tablet (20 count)',
            price: 6.99,
            requiresRx: false,
            reason: 'Fast-acting fever reducer and mild-to-moderate pain reliever',
          },
        ],
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddMedToCart = (medId: string) => {
    const med = MEDICINES.find((m) => m.id === medId);
    if (med) {
      onAddToCart(med);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-cleared',
        sender: 'bot',
        text: 'Chat history cleared. Tell me your symptom (e.g. "I have fever") to receive medication suggestions! 🩺',
        time: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-[340px] sm:w-[420px] bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col mb-4 animate-in slide-in-from-bottom-5 duration-200"
          style={{ height: '560px' }}
        >
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
            DAYMES AI provides verified healthcare & pharmacy guidance. For emergency diagnosis, always consult a certified physician.
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
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800/95 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs font-normal">
                    {msg.text}
                  </div>

                  {/* Render Recommended Medicines Cards */}
                  {msg.suggestedMedicines && msg.suggestedMedicines.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-700/60">
                      <p className="text-[10px] font-extrabold text-teal-300 uppercase tracking-wider">
                        💊 Recommended Medications:
                      </p>
                      {msg.suggestedMedicines.map((med) => (
                        <div
                          key={med.id}
                          className="p-2.5 bg-slate-900/90 border border-slate-700 rounded-xl flex items-center justify-between gap-2 shadow-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-white text-xs truncate">{med.name}</h5>
                            <p className="text-[10px] text-slate-400 truncate">{med.reason}</p>
                            <span className="text-[11px] font-extrabold text-teal-400">
                              {formatPrice(med.price)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddMedToCart(med.id)}
                            className="px-2.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-[10px] flex items-center gap-1 shadow-md transition-all active:scale-95 flex-shrink-0"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="block text-[9px] text-slate-400 text-right opacity-70">
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
              <div className="flex gap-2 items-center text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                <span>DAYMES Assistant is analyzing symptoms & medicines…</span>
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
                className="px-2.5 py-1 bg-slate-800/90 border border-slate-700 text-slate-200 rounded-full text-[10px] font-semibold whitespace-nowrap hover:bg-teal-500 hover:text-slate-950 transition-all flex items-center gap-1 shadow-sm"
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
              placeholder="Ask for medicine (e.g. I have fever)..."
              className="flex-1 px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold transition-all shadow-md active:scale-95"
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
