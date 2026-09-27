import React from 'react';
import { Volume2, VolumeX, Music, RotateCcw, Sparkles, HeartHandshake, Mic } from 'lucide-react';
import { VIP_RANKS } from '../data/loungeData';
import { VoiceMode } from '../utils/audio';

interface HeaderProps {
  affinity: number;
  bgmActive: boolean;
  onToggleBgm: () => void;
  voiceMode: VoiceMode;
  onOpenVoiceModal: () => void;
  soundFxActive: boolean;
  onToggleSoundFx: () => void;
  onReset: () => void;
  onOpenPersonaModal: () => void;
  isSpeaking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  affinity,
  bgmActive,
  onToggleBgm,
  voiceMode,
  onOpenVoiceModal,
  soundFxActive,
  onToggleSoundFx,
  onReset,
  onOpenPersonaModal,
  isSpeaking,
}) => {
  const currentRank = [...VIP_RANKS].reverse().find((r) => affinity >= r.minAffinity) || VIP_RANKS[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0d0f17]/90 backdrop-blur-md border-b border-amber-900/30 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Salon Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 flex items-center justify-center p-[1px] shadow-lg shadow-amber-900/20">
            <div className="w-full h-full rounded-full bg-[#0b0c10] flex items-center justify-center">
              <span className="font-cormorant text-xl font-bold text-amber-300">E</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cormorant text-2xl sm:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                Salon d'Emma
              </h1>
              <span className="text-[10px] tracking-widest text-amber-400/80 uppercase font-sans border border-amber-500/30 px-1.5 py-0.5 rounded">
                Ginza VIP
              </span>
            </div>
            <p className="text-xs text-amber-200/60 font-serif-jp hidden sm:block">
              銀座最高級クラブ・若きママ「エマ」の会員制サロン
            </p>
          </div>
        </div>

        {/* Status & Control buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* VIP Rank badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif-jp border shadow-sm ${currentRank.badgeColor}`}
            title={currentRank.benefit}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">{currentRank.name}</span>
            <span className="text-[10px] opacity-80">({affinity}pt)</span>
          </div>

          {/* Sound Controls */}
          <div className="flex items-center bg-[#151922] border border-amber-900/40 rounded-full p-1 gap-1">
            {/* BGM Toggle */}
            <button
              onClick={onToggleBgm}
              className={`p-1.5 rounded-full transition-all text-xs flex items-center gap-1 px-2.5 cursor-pointer ${
                bgmActive
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="ラウンジBGM（生演奏ジャズピアノ調）"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="text-[11px] font-sans">BGM</span>
            </button>

            {/* Voice Mode Selector & Settings Button */}
            <button
              onClick={onOpenVoiceModal}
              className={`p-1.5 rounded-full transition-all text-xs flex items-center gap-1.5 px-2.5 cursor-pointer ${
                voiceMode !== 'off'
                  ? 'bg-gradient-to-r from-amber-600/40 to-yellow-600/30 text-amber-200 border border-amber-500/50'
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
              title="エマの音声（ボイス）設定を開く"
            >
              {voiceMode === 'off' ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-rose-400 animate-bounce' : 'text-amber-300'}`} />
              )}
              <span className="text-[11px] font-sans font-medium">
                {voiceMode === 'ai' ? 'AIボイス' : voiceMode === 'webspeech' ? '標準音声' : '無音'}
              </span>
              {isSpeaking && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={onToggleSoundFx}
              className={`p-1.5 rounded-full transition-all text-xs flex items-center gap-1 px-2 cursor-pointer ${
                soundFxActive
                  ? 'text-amber-300'
                  : 'text-zinc-600 line-through'
              }`}
              title="乾杯・効果音"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Persona info & Reset */}
          <button
            onClick={onOpenPersonaModal}
            className="px-2.5 py-1 text-xs text-amber-300/80 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/40 rounded-full transition-all cursor-pointer"
            title="エマのプロフィール・設定"
          >
            ママ詳細
          </button>

          <button
            onClick={onReset}
            className="p-1.5 text-zinc-400 hover:text-amber-200 bg-[#151922] hover:bg-amber-950/50 border border-zinc-800 rounded-full transition-all cursor-pointer"
            title="会話履歴と好感度をリセット"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
