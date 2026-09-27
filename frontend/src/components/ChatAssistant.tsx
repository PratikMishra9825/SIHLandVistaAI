import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Cpu, 
  Minimize2, 
  Maximize2, 
  HelpCircle 
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';

export const ChatAssistant: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, sendChatMessage, isAiGenerating, selectedParcel } = useLand();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Why is Solar Farm ranked #1 for this land?',
    'What crops are suitable for this soil pH?',
    'What government subsidies can I apply for?',
    'How does summer groundwater stress affect agriculture?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiGenerating]);

  if (!isChatOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    setInputText('');
    await sendChatMessage(text);
  };

  return (
    <div className="fixed bottom-2 right-2 left-2 sm:left-auto sm:bottom-4 sm:right-4 z-50 w-auto sm:w-96 max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-32px)] h-[480px] sm:h-[520px] bg-[#FFFFFF] rounded-3xl border border-[#D5E1D9] shadow-2xl flex flex-col font-sans overflow-hidden text-[#17211B] animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Chat Header */}
      <div className="p-4 bg-[#F8FBF9] border-b border-[#D5E1D9] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-[#17211B] uppercase tracking-wider">
                LandVista AI Copilot
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
            </div>
            <p className="text-[10px] text-[#405048] font-semibold truncate max-w-[180px]">
              Active: {selectedParcel.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="p-1.5 rounded-lg text-[#64736A] hover:text-[#17211B] hover:bg-[#E8F5EC] transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-sans">
        {chatMessages.map((msg) => {
          const isAI = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-6 h-6 rounded-lg bg-[#E8F5EC] border border-[#BDE3CC] flex items-center justify-center text-[#15803D] shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  isAI
                    ? 'bg-[#F8FBF9] text-[#17211B] border border-[#D5E1D9] shadow-sm font-medium'
                    : 'bg-[#15803D] text-white font-bold'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-[#D5E1D9]/40 text-[9px] text-[#64736A]">
                  <span>
                    {msg.timestamp instanceof Date
                      ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Just now'}
                  </span>
                  {isAI && (
                    <span className="text-[#166534] font-bold">
                      ⚡ Gemini 1.5 Active
                    </span>
                  )}
                </div>
              </div>

              {!isAI && (
                <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF] shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isAiGenerating && (
          <div className="flex items-center gap-2 text-[#405048] font-bold text-xs">
            <Cpu className="w-3.5 h-3.5 text-[#15803D] animate-spin" />
            <span>LandVista AI is synthesizing telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions Pills */}
      <div className="px-3 py-2 bg-[#F8FBF9] border-t border-[#D5E1D9] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#E8F5EC] text-[#17211B] font-semibold whitespace-nowrap border border-[#D5E1D9] transition-all hover:scale-105 text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#FFFFFF] border-t border-[#D5E1D9] flex items-center gap-2 text-xs">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about solar, soil, water, schemes..."
          className="flex-1 px-3 py-2 rounded-xl bg-[#F8FBF9] border border-[#D5E1D9] text-[#17211B] text-xs font-semibold outline-none focus:border-[#15803D]"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold shadow-sm transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
