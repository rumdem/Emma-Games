import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Sparkles, Heart, Wine, MessageSquareQuote, Flame } from 'lucide-react';
import { ChatMessage } from '../types';
import { loungeAudio } from '../utils/audio';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  onOpenDrinkMenu: () => void;
  onOpenTopics: () => void;
  voiceActive: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isThinking,
  onOpenDrinkMenu,
  onOpenTopics,
  voiceActive,
}) => {
  const [inputText, setInputText] = useState('');
  const [revealedThoughts, setRevealedThoughts] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const toggleThought = (id: string) => {
    setRevealedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSpeak = (text: string, mood?: string) => {
    loungeAudio.speak(text, mood);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0c10]/95 border border-amber-900/30 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-[#0d0f18] border-b border-amber-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <h2 className="font-serif-jp text-sm font-semibold text-amber-200">
            エマとの対話
          </h2>
          <span className="text-[10px] text-zinc-500 font-sans">
            銀座会員制ラウンジ
          </span>
        </div>

        {/* Quick action bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDrinkMenu}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/30 text-amber-200 text-xs font-serif-jp transition-all cursor-pointer"
          >
            <Wine className="w-3.5 h-3.5 text-amber-400" />
            <span>お酒メニュー</span>
          </button>
          <button
            onClick={onOpenTopics}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#161a26] hover:bg-[#1f2538] border border-zinc-800 text-zinc-300 text-xs font-serif-jp transition-all cursor-pointer"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
            <span>話題</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-zinc-500 font-sans">{msg.timestamp}</span>
                  <span className="text-xs font-serif-jp text-amber-300/80">貴方</span>
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-amber-900/40 to-amber-950/60 border border-amber-600/30 px-4 py-2.5 text-amber-50 text-xs sm:text-sm font-serif-jp leading-relaxed shadow-lg">
                  {msg.drinkName && (
                    <div className="mb-1.5 pb-1.5 border-b border-amber-600/20 text-amber-300 font-semibold text-xs flex items-center gap-1">
                      <Wine className="w-3.5 h-3.5" />
                      <span>【ご注文】{msg.drinkName}</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            );
          }

          // Emma's message
          const moodBadge = {
            tsun: { label: 'ツン', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40' },
            dere: { label: 'デレ', color: 'bg-rose-950/80 text-rose-300 border-rose-500/40' },
            neutral: { label: '優雅', color: 'bg-amber-950/80 text-amber-300 border-amber-500/40' },
            surprised: { label: '動揺', color: 'bg-pink-950/80 text-pink-300 border-pink-500/40' },
          }[msg.mood || 'neutral'];

          return (
            <div key={msg.id} className="flex flex-col items-start space-y-1.5 max-w-[92%] sm:max-w-[85%]">
              {/* Speaker header */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] font-bold text-black font-cormorant">
                  E
                </div>
                <span className="text-xs font-serif-jp text-amber-200 font-semibold">エマ</span>
                {moodBadge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-sans ${moodBadge.color}`}>
                    {moodBadge.label}
                  </span>
                )}
                {msg.tsunRatio !== undefined && (
                  <span className="text-[10px] text-zinc-500 font-sans flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-indigo-400" />
                    ツン{msg.tsunRatio}%
                  </span>
                )}
                <span className="text-[10px] text-zinc-600 font-sans">{msg.timestamp}</span>
              </div>

              {/* Action narration */}
              {msg.reactionAction && (
                <div className="text-[11px] text-amber-300/80 italic pl-2 border-l border-amber-500/30 font-serif-jp">
                  *{msg.reactionAction}*
                </div>
              )}

              {/* Main Dialogue bubble */}
              <div className="relative group w-full rounded-2xl rounded-tl-sm bg-[#131722]/90 border border-amber-900/40 px-4 py-3 text-zinc-100 text-xs sm:text-sm font-serif-jp leading-relaxed shadow-lg">
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Voice button */}
                <button
                  onClick={() => handleSpeak(msg.text, msg.mood)}
                  className="absolute top-2 right-2 p-1 rounded-full text-zinc-500 hover:text-amber-300 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="エマの声をもう一度聴く（AIニューラルボイス）"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Inner Thought (心の声) */}
              {msg.innerThought && (
                <div className="w-full">
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-300/80">
                    <button
                      onClick={() => toggleThought(msg.id)}
                      className="flex items-center gap-1 hover:text-rose-200 font-serif-jp transition-colors cursor-pointer"
                    >
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span>本音を{revealedThoughts[msg.id] ? '隠す' : '覗く'}</span>
                    </button>
                  </div>
                  {revealedThoughts[msg.id] && (
                    <div className="mt-1 p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200/90 italic font-serif-jp animate-in fade-in duration-200">
                      {msg.innerThought}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-amber-300/70 font-serif-jp animate-pulse pl-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>エマが足を組み替え、グラスを傾けております…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#0d0f18] border-t border-amber-900/30">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="エマに言葉をかける…（例: 今夜もとても美しいですね）"
            disabled={isThinking}
            className="w-full rounded-xl bg-[#141824] border border-amber-900/40 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30 px-4 py-2.5 pr-20 text-xs sm:text-sm text-amber-100 placeholder-zinc-500 font-serif-jp transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-40 disabled:hover:from-amber-600 disabled:hover:to-yellow-600 text-zinc-950 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-amber-950/40"
          >
            <span>囁く</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
