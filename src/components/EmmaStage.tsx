import React, { useState } from 'react';
import { Sparkles, Eye, Heart, GlassWater, MessageSquareQuote, Flame } from 'lucide-react';
import { EmmaMood } from '../types';

import emmaPortraitImg from '../assets/images/emma_portrait_1790519529358.jpg';
import emmaDereImg from '../assets/images/emma_dere_1790519546079.jpg';

interface EmmaStageProps {
  mood: EmmaMood;
  tsunRatio: number;
  affinity: number;
  latestAction?: string;
  latestInnerThought?: string;
  isThinking: boolean;
  isSpeaking?: boolean;
  onStopSpeech?: () => void;
  onOpenDrinkMenu: () => void;
  onOpenTopics: () => void;
}

export const EmmaStage: React.FC<EmmaStageProps> = ({
  mood,
  tsunRatio,
  affinity,
  latestAction,
  latestInnerThought,
  isThinking,
  isSpeaking,
  onStopSpeech,
  onOpenDrinkMenu,
  onOpenTopics,
}) => {
  const [showInnerThought, setShowInnerThought] = useState<boolean>(true);
  const [manualPose, setManualPose] = useState<'auto' | 'portrait' | 'dere'>('auto');

  // Determine active visual image
  const isDereMode = manualPose === 'dere' || (manualPose === 'auto' && (mood === 'dere' || tsunRatio < 40 || affinity >= 75));
  const currentImage = isDereMode ? emmaDereImg : emmaPortraitImg;

  // Mood label and styling
  const moodConfig = {
    tsun: {
      label: '高飛車・ツン',
      color: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/40',
      aura: 'from-blue-600/20 via-indigo-900/20 to-transparent',
    },
    dere: {
      label: '照れ甘え・デレ',
      color: 'bg-rose-900/60 text-rose-300 border-rose-500/40',
      aura: 'from-rose-600/30 via-pink-900/20 to-transparent',
    },
    neutral: {
      label: '優雅・微笑み',
      color: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
      aura: 'from-amber-600/20 via-yellow-900/10 to-transparent',
    },
    surprised: {
      label: '動揺・赤面',
      color: 'bg-pink-900/60 text-pink-300 border-pink-500/40',
      aura: 'from-pink-600/30 via-red-900/20 to-transparent',
    },
  }[mood] || {
    label: '優雅',
    color: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
    aura: 'from-amber-600/20 to-transparent',
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#10131d] via-[#0b0c10] to-[#08090d] border border-amber-900/30 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Background ambient lighting */}
      <div className={`absolute inset-0 bg-radial ${moodConfig.aura} pointer-events-none transition-all duration-1000`} />

      {/* Floating subtle champagne bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-300 bubble-anim" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-1/3 w-2 h-2 rounded-full bg-yellow-200 bubble-anim" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-6 right-1/4 w-1 h-1 rounded-full bg-amber-400 bubble-anim" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Emma's Stage Header with Mood & Pose controls */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-between border-b border-amber-900/20 bg-[#0d0f17]/70 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 candle-glow" />
          <span className="font-serif-jp text-sm text-amber-100 font-semibold tracking-wider">
            若きママ エマ
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-sans ${moodConfig.color}`}>
            {moodConfig.label}
          </span>
        </div>

        {/* Expression toggle */}
        <div className="flex items-center gap-1 bg-[#131722] border border-amber-900/30 rounded-lg p-0.5 text-[11px]">
          <button
            onClick={() => setManualPose('auto')}
            className={`px-2 py-0.5 rounded ${manualPose === 'auto' ? 'bg-amber-600/40 text-amber-200' : 'text-zinc-400'}`}
          >
            感情連動
          </button>
          <button
            onClick={() => setManualPose('portrait')}
            className={`px-2 py-0.5 rounded ${manualPose === 'portrait' ? 'bg-amber-600/40 text-amber-200' : 'text-zinc-400'}`}
          >
            冷艶
          </button>
          <button
            onClick={() => setManualPose('dere')}
            className={`px-2 py-0.5 rounded ${manualPose === 'dere' ? 'bg-rose-600/40 text-rose-200' : 'text-zinc-400'}`}
          >
            照れ笑み
          </button>
        </div>
      </div>

      {/* Portrait visual container */}
      <div className="relative flex-1 min-h-[340px] max-h-[460px] sm:max-h-[520px] flex items-center justify-center p-3 overflow-hidden group">
        <div className="relative w-full h-full max-w-[420px] rounded-xl overflow-hidden border border-amber-500/20 shadow-xl bg-black/40">
          <img
            src={currentImage}
            alt="銀座のママ エマ"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />

          {/* Vignette & bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-80" />

          {/* Thinking overlay */}
          {isThinking && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 transition-all z-20">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400/40 border-t-amber-300 animate-spin" />
              <p className="text-xs text-amber-200 font-serif-jp tracking-widest animate-pulse">
                エマが言葉を選んでおりますわ…
              </p>
            </div>
          )}

          {/* Speaking Wave overlay */}
          {isSpeaking && (
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between bg-black/70 backdrop-blur-md border border-amber-500/50 rounded-full px-3 py-1.5 shadow-lg shadow-amber-950/60 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 text-xs text-amber-200 font-serif-jp">
                <div className="flex items-end gap-0.5 h-3.5 px-1">
                  <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-full" />
                  <span className="w-1 bg-amber-300 rounded-full animate-[bounce_0.6s_infinite_250ms] h-3/4" />
                  <span className="w-1 bg-yellow-400 rounded-full animate-[bounce_0.6s_infinite_150ms] h-4/5" />
                  <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-1/2" />
                </div>
                <span className="text-[11px] tracking-wide">エマがお話し中…</span>
              </div>
              {onStopSpeech && (
                <button
                  onClick={onStopSpeech}
                  className="text-[10px] text-zinc-400 hover:text-rose-300 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full transition-all cursor-pointer"
                >
                  静かに
                </button>
              )}
            </div>
          )}

          {/* Quick interactive overlay buttons */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <button
              onClick={onOpenDrinkMenu}
              className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-900/90 to-amber-950/90 hover:from-amber-800 hover:to-amber-900 border border-amber-500/50 shadow-lg text-amber-100 text-xs font-serif-jp flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
            >
              <GlassWater className="w-4 h-4 text-amber-300" />
              <span>お酒をご馳走する</span>
            </button>
            <button
              onClick={onOpenTopics}
              className="py-2 px-3 rounded-lg bg-[#141824]/90 hover:bg-[#1c2234] border border-amber-900/50 text-amber-200/90 text-xs font-serif-jp flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageSquareQuote className="w-4 h-4 text-amber-400" />
              <span>話題を選ぶ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tsundere & Affinity Gauges */}
      <div className="relative z-10 px-4 py-3 bg-[#0d0f18]/80 border-t border-amber-900/30 space-y-2.5">
        {/* Tsundere Balance Meter */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-serif-jp text-amber-200/80 mb-1">
            <span className="flex items-center gap-1 text-indigo-300">
              <Flame className="w-3 h-3" /> 高飛車（ツン） {tsunRatio}%
            </span>
            <span className="text-[10px] text-zinc-400 font-sans">ツンデレバランス</span>
            <span className="flex items-center gap-1 text-rose-300">
              甘美（デレ） {100 - tsunRatio}% <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden relative border border-amber-900/40">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 transition-all duration-700"
              style={{ width: `${100 - tsunRatio}%`, marginLeft: 'auto' }}
            />
          </div>
        </div>

        {/* Action / Gesture Box */}
        {latestAction && (
          <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 italic flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="line-clamp-1">{latestAction}</span>
          </div>
        )}

        {/* Secret Inner Thought (心の声) */}
        {latestInnerThought && (
          <div className="rounded-lg bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/30 border border-rose-500/30 p-2.5 transition-all">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-serif-jp">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span className="font-semibold">エマの心の声（本音）</span>
              </div>
              <button
                onClick={() => setShowInnerThought(!showInnerThought)}
                className="text-[10px] text-rose-300/70 hover:text-rose-200 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>{showInnerThought ? '隠す' : '覗く'}</span>
              </button>
            </div>
            {showInnerThought ? (
              <p className="text-xs text-rose-100/90 font-serif-jp leading-relaxed pl-1 border-l-2 border-rose-400/40 italic">
                {latestInnerThought}
              </p>
            ) : (
              <p className="text-[11px] text-zinc-500 italic pl-1">
                （エマの恥ずかしい本音は伏せられています…クリックで表示）
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
