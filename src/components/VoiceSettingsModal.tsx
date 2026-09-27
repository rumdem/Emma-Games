import React, { useState } from 'react';
import { X, Volume2, Sparkles, Sliders, Play, Square, Check } from 'lucide-react';
import { loungeAudio, VoiceMode } from '../utils/audio';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceMode: VoiceMode;
  onVoiceModeChange: (mode: VoiceMode) => void;
  aiVoice: string;
  onAiVoiceChange: (voice: string) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  voiceMode,
  onVoiceModeChange,
  aiVoice,
  onAiVoiceChange,
}) => {
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [volume, setVolumeState] = useState(0.9);

  if (!isOpen) return null;

  const handleTestVoice = async () => {
    if (isPlayingSample) {
      loungeAudio.stopSpeech();
      setIsPlayingSample(false);
      return;
    }

    setIsPlayingSample(true);
    const sampleText =
      'あら、わたくしの声がそんなにお気に召しましたの？ ……ふふ、調子に乗らないでくださいませ。';

    try {
      await loungeAudio.speak(sampleText, 'dere');
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlayingSample(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolumeState(val);
    loungeAudio.setVolume(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#131724] to-[#0c0e14] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-900/30 flex items-center justify-between bg-[#171c2c]/70">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-serif-jp text-lg font-bold text-amber-200 tracking-wider">
                エマの音声（ボイス）設定
              </h2>
              <p className="text-xs text-amber-200/60 font-serif-jp">
                Gemini最先端ニューラルAIボイスによる臨場感ある朗読
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

        {/* Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm font-serif-jp">
          {/* Voice Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>音声エンジン選択</span>
            </label>

            {/* AI Neural Voice Option */}
            <div
              onClick={() => {
                onVoiceModeChange('ai');
                loungeAudio.setVoiceMode('ai');
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                voiceMode === 'ai'
                  ? 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-950/50'
                  : 'bg-[#121622] border-amber-900/30 hover:border-amber-700/50'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-100">
                    💎 極上Gemini AIニューラルボイス
                  </span>
                  <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold px-1.5 py-0.5 rounded">
                    推奨
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  感情豊かで息づかいまで再現される最先端AI音声モデル（gemini-3.8-flash-lite-tts）。機械的な違和感がなく、銀座のママの優雅で魅惑的な声で語りかけます。
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  voiceMode === 'ai'
                    ? 'border-amber-400 bg-amber-500 text-black'
                    : 'border-zinc-600'
                }`}
              >
                {voiceMode === 'ai' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* AI Voice Persona Selection (When AI is active) */}
            {voiceMode === 'ai' && (
              <div className="pl-4 pr-1 py-2 grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => {
                    onAiVoiceChange('Kore');
                    loungeAudio.setAiVoice('Kore');
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    aiVoice === 'Kore'
                      ? 'bg-amber-600/30 border-amber-400 text-amber-100'
                      : 'bg-[#151926] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-semibold text-xs">Kore（コレ）</div>
                  <div className="text-[11px] opacity-80 mt-0.5">気品と華のある若きママ声</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAiVoiceChange('Zephyr');
                    loungeAudio.setAiVoice('Zephyr');
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    aiVoice === 'Zephyr'
                      ? 'bg-amber-600/30 border-amber-400 text-amber-100'
                      : 'bg-[#151926] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-semibold text-xs">Zephyr（ゼファー）</div>
                  <div className="text-[11px] opacity-80 mt-0.5">落ち着いた大人の色気声</div>
                </button>
              </div>
            )}

            {/* Web Speech Option */}
            <div
              onClick={() => {
                onVoiceModeChange('webspeech');
                loungeAudio.setVoiceMode('webspeech');
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                voiceMode === 'webspeech'
                  ? 'bg-amber-950/30 border-amber-500/60'
                  : 'bg-[#121622] border-amber-900/20 hover:border-amber-800/40'
              }`}
            >
              <div>
                <span className="font-medium text-zinc-300">
                  💻 ブラウザ標準の合成音声（軽量・オフライン対応）
                </span>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  端末内蔵の音声。環境によっては機械的な音質になる場合があります。
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  voiceMode === 'webspeech'
                    ? 'border-amber-400 bg-amber-500 text-black'
                    : 'border-zinc-600'
                }`}
              >
                {voiceMode === 'webspeech' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* OFF Option */}
            <div
              onClick={() => {
                onVoiceModeChange('off');
                loungeAudio.setVoiceMode('off');
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                voiceMode === 'off'
                  ? 'bg-amber-950/30 border-amber-500/60'
                  : 'bg-[#121622] border-amber-900/20 hover:border-amber-800/40'
              }`}
            >
              <div>
                <span className="font-medium text-zinc-400">🔇 音声読み上げをミュート（OFF）</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">テキストのみで静かに会話をお楽しみいただけます。</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  voiceMode === 'off'
                    ? 'border-amber-400 bg-amber-500 text-black'
                    : 'border-zinc-600'
                }`}
              >
                {voiceMode === 'off' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Volume Control */}
          <div className="p-3.5 rounded-xl bg-[#121622] border border-amber-900/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                音量調節
              </span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Test Sample Voice Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleTestVoice}
              disabled={voiceMode === 'off'}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-40 text-zinc-950 text-xs font-bold font-serif-jp flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isPlayingSample ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-black" />
                  <span>停止する</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>エマの声を試聴する</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-serif-jp transition-all"
            >
              完了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
