import React from 'react';
import { X, Crown, Sparkles, Heart, Feather, UserCheck } from 'lucide-react';
import emmaPortraitImg from '../assets/images/emma_portrait_1790519529358.jpg';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#141824] to-[#0c0e14] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-900/30 flex items-center justify-between bg-[#181d2e]/70">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="font-cormorant text-2xl font-bold text-amber-200 tracking-wider">
              Madame Emma • Persona Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-amber-200 hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm font-serif-jp leading-relaxed text-zinc-300">
          {/* Hero Bio Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black/40 border border-amber-700/30">
            <img
              src={emmaPortraitImg}
              alt="エマ"
              className="w-20 h-24 sm:w-24 sm:h-32 object-cover object-top rounded-lg border border-amber-500/30 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-amber-100 font-serif-jp">エマ (Emma)</h3>
                <span className="text-xs text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-sans">
                  銀座高級クラブの若きママ
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-1 italic">
                「銀座の夜は長いですのよ。わたくしの美貌に見惚れるだけではなく、殿方としての気概をお見せなさいな。」
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-400">
                <span className="bg-black/40 px-2 py-0.5 rounded border border-amber-900/40">碧い瞳（サファイアブルー）</span>
                <span className="bg-black/40 px-2 py-0.5 rounded border border-amber-900/40">ブロンドの長いパーマヘア</span>
                <span className="bg-black/40 px-2 py-0.5 rounded border border-amber-900/40">紺ノースリーブニット</span>
                <span className="bg-black/40 px-2 py-0.5 rounded border border-amber-900/40">白タイトスカート＆ピンヒール</span>
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#121622] border border-amber-900/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>気品とお嬢様言葉</span>
              </div>
              <p className="text-xs text-zinc-300">
                一人称は「わたくし」。「〜ですわ」「〜ですのよ」「〜して差し上げますわ」など格式高く高貴な語調で話します。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121622] border border-amber-900/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>高飛車 ＆ ツンデレ</span>
              </div>
              <p className="text-xs text-zinc-300">
                少し上から目線でからかい挑発しつつも、殿方の真摯な言葉や好意にふと胸を打たれ、照れたり甘い顔を覗かせます。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121622] border border-amber-900/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-yellow-300 font-semibold text-xs">
                <Feather className="w-4 h-4 text-yellow-400" />
                <span>知性と導き</span>
              </div>
              <p className="text-xs text-zinc-300">
                決してお客様を無下に突き放さず、代替案や洗練された機知で夜の会話を豊かにエスコートします。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121622] border border-amber-900/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>親愛度の変化</span>
              </div>
              <p className="text-xs text-zinc-300">
                親愛度（好感度）が上がると、高飛車な仮面の下から純情で一途なデレの素顔がこぼれ出します。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-amber-900/30 bg-[#0c0e14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/50 border border-amber-600/40 text-amber-200 text-xs font-serif-jp transition-all"
          >
            サロンに戻る
          </button>
        </div>
      </div>
    </div>
  );
};
