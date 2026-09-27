import React from 'react';
import { X, MessageSquareQuote, Sparkles } from 'lucide-react';
import { TOPIC_SUGGESTIONS } from '../data/loungeData';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (prompt: string) => void;
}

export const TopicModal: React.FC<TopicModalProps> = ({ isOpen, onClose, onSelectTopic }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#131724] to-[#0c0e14] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-900/30 flex items-center justify-between bg-[#171c2c]/60">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-serif-jp text-lg font-bold text-amber-200 tracking-wider">
                エマとの会話のきっかけ
              </h2>
              <p className="text-xs text-amber-200/60 font-serif-jp">
                銀座の夜を彩る、高飛車な彼女への問いかけ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-amber-200 hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topics List */}
        <div className="p-4 sm:p-6 space-y-2.5 max-h-[65vh] overflow-y-auto">
          {TOPIC_SUGGESTIONS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectTopic(topic.prompt);
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-amber-950/40 border border-amber-900/30 hover:border-amber-500/50 transition-all group flex items-start gap-3 cursor-pointer"
            >
              <span className="text-xl p-2 rounded-lg bg-black/40 border border-amber-900/30 group-hover:scale-110 transition-transform">
                {topic.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-amber-200 font-serif-jp group-hover:text-amber-100">
                    {topic.title}
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-zinc-300 mt-1 font-serif-jp leading-relaxed">
                  「{topic.prompt}」
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-amber-900/30 bg-[#0c0e14] flex justify-end">
          <button
            onClick={onClose}
            className="text-xs text-amber-300/80 hover:text-amber-200 font-serif-jp"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
