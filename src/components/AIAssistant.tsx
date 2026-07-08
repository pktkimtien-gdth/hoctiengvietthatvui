/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  HelpCircle,
  BrainCircuit,
  Bot,
  Compass,
  ArrowRight
} from 'lucide-react';
import { GradeType } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  isSimulated?: boolean;
}

interface AIAssistantProps {
  selectedGrade: GradeType;
}

export default function AIAssistant({ selectedGrade }: AIAssistantProps) {
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'tutor',
      text: `### 👋 Thầy Cô AI chào bạn nhỏ!
      
Hôm nay em muốn cùng Thầy Cô khám phá kiến thức Tiếng Việt thú vị nào? Thầy Cô có thể giúp em đặt câu so sánh, phân biệt chính tả lắt léo hay tư vấn lập dàn ý Tập làm văn cực chất nhé! ✨🎒`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Quick suggestion prompts for primary schoolers
  const quickPrompts = [
    { label: '💡 Ôn quy tắc "g/gh" & "ng/ngh"', text: 'Hãy giải thích quy tắc chính tả khi nào viết gh và ngh kèm ví dụ dễ thương.' },
    { label: '🌸 Đặt câu có Phép Nhân Hóa', text: 'Hãy đặt giúp em 3 câu miêu tả sử dụng phép Nhân Hóa về con vật hoặc đồ vật trường lớp.' },
    { label: '📝 Phân biệt Từ Ghép và Từ Láy', text: 'Thầy Cô ơi, hãy giúp em phân biệt từ ghép và từ láy siêu nhanh, có mẹo nào không ạ?' },
    { label: '🌳 Hướng dẫn tả cảnh Đồi Núi', text: 'Gợi ý cho em lập dàn ý chi tiết bài văn tả cảnh đẹp đồi núi hoặc cánh đồng quê hương lớp 5.' },
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          grade: selectedGrade,
          topic: 'Trợ lý học tập Tiếng Việt'
        }),
      });

      if (!response.ok) {
        throw new Error('Mạng kết nối không ổn định.');
      }

      const data = await response.json();
      
      const tutorMsg: Message = {
        id: `msg-${Date.now()}-t`,
        sender: 'tutor',
        text: data.text || 'Thầy Cô đang bận chấm bài, em đặt câu hỏi khác nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: data.isSimulated
      };

      setMessages((prev) => [...prev, tutorMsg]);
      if (data.isSimulated) {
        setIsSimulatedMode(true);
      }
    } catch (error) {
      console.error('Error talking to AI Tutor:', error);
      
      // Client-side fail-safe if network fails completely
      const tutorMsg: Message = {
        id: `msg-${Date.now()}-t`,
        sender: 'tutor',
        text: `### 🎒 Chế độ ngoại tuyến kết nối!
        
Thầy Cô AI tạm thời chưa kết nối được máy chủ, nhưng em đừng lo nhé! Hãy ôn tập các quy tắc cốt lõi:
- **gh, ngh, k** luôn đi với các nguyên âm **e, ê, i**.
- **g, ng, c** đi với các nguyên âm còn lại.
- **Từ ghép** các tiếng có nghĩa ghép lại; **Từ láy** có sự trùng lặp âm vần sinh động.

Chúc em học tốt nha! 🌟`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: true
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="ai-tutor-container">
      
      {/* Left Column: Tips and Quick suggestion buttons */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Tips details */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Compass className="w-5 h-5 text-sky-500 animate-spin-slow" />
            <h3 className="font-display font-bold text-sm text-slate-800">Cẩm nang ôn luyện</h3>
          </div>
          <div className="text-3xs font-bold text-slate-500 leading-normal space-y-2.5">
            <p>🌟 Trợ lý AI được tích hợp mô hình ngôn ngữ lớn tiên tiến nhất từ Google (Gemini 3.5 Flash) giúp trả lời mọi câu hỏi Tiếng Việt sư phạm chuẩn xác.</p>
            <p>💡 Thầy cô và ba mẹ có thể đồng hành cùng con bằng cách đặt câu hỏi nhờ AI chấm câu, góp ý từ vựng hoặc đề nghị lên dàn bài Tập làm văn mẫu.</p>
          </div>
        </div>

        {/* Quick tap Prompts */}
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <BrainCircuit className="w-5 h-5 text-emerald-500" />
            <h3 className="font-display font-bold text-sm text-slate-800">Câu hỏi gợi ý</h3>
          </div>
          <div className="space-y-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                disabled={isLoading}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 text-3xs font-extrabold text-slate-600 rounded-xl transition-all border border-slate-100 flex justify-between items-center cursor-pointer"
              >
                <span className="truncate pr-2">{p.label}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Chat box container */}
      <div className="lg:col-span-3 bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-2xs h-[450px] sm:h-[550px] flex flex-col justify-between" id="ai-chat-box">
        
        {/* Top Chat Bar header */}
        <div className="bg-sky-500 text-white px-5 py-4 flex justify-between items-center border-b-2 border-sky-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/25 shadow-sm">
              <Bot className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm leading-tight">Thầy Cô AI Tiếng Việt 🌟</h3>
              <span className="text-4xs text-sky-100 font-bold">Lớp {selectedGrade} • Trực tuyến</span>
            </div>
          </div>
          
          {isSimulatedMode && (
            <span className="text-4xs font-bold bg-amber-400 text-white px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
              Simulated Mode
            </span>
          )}
        </div>

        {/* Messages Logs Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50 flex flex-col">
          {messages.map((msg) => {
            const isTutor = msg.sender === 'tutor';
            return (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${isTutor ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-3xs ${
                  isTutor ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {isTutor ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Speech Bubble */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed font-semibold shadow-4xs ${
                    isTutor
                      ? 'bg-white border text-slate-700 rounded-tl-none'
                      : 'bg-emerald-500 text-white rounded-tr-none'
                  }`}>
                    {/* Render simple HTML styled lines for tutoring answers */}
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return <h4 key={idx} className="font-display font-extrabold text-sm text-sky-600 mt-2 mb-1.5">{line.replace('### ', '')}</h4>;
                      }
                      if (line.startsWith('**') || line.startsWith('1. **') || line.startsWith('2. **') || line.startsWith('3. **')) {
                        return <p key={idx} className="font-extrabold text-slate-800 mt-1">{line}</p>;
                      }
                      return <p key={idx} className="mt-0.5">{line}</p>;
                    })}
                  </div>
                  <span className={`text-5xs text-slate-400 font-bold block ${isTutor ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing state animation indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border px-4 py-3 rounded-2xl rounded-tl-none text-2xs text-slate-400 font-bold flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Thầy Cô AI đang suy nghĩ...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Trigger Bar */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Đặt câu hỏi về Tiếng Việt tại đây cho Thầy Cô AI..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none text-xs font-semibold"
            disabled={isLoading}
            aria-label="Khung chat đặt câu hỏi AI"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-display font-bold text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-40 cursor-pointer"
          >
            Gửi <Send className="w-3.5 h-3.5 fill-white" />
          </button>
        </div>

      </div>

    </div>
  );
}
