/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmmaStage } from './components/EmmaStage';
import { ChatPanel } from './components/ChatPanel';
import { DrinkModal } from './components/DrinkModal';
import { TopicModal } from './components/TopicModal';
import { PersonaModal } from './components/PersonaModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { ChatMessage, DrinkItem, EmmaMood } from './types';
import { loungeAudio, VoiceMode } from './utils/audio';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  sender: 'emma',
  text: `あら、いらっしゃいませ。ようこそ『Salon d'Emma』へ。……ふふ、少々緊張したお顔をなさって、可愛らしいことですわね。わたくしがこのサロンのママ、エマでございますわ。今宵は特別に貴方のお相手をして差し上げますけれど、冷やかしならお帰りいただきますわよ？ さあ、まずはお喉を潤す極上の一杯でもいかが？`,
  innerThought: `（ふん、どんな無粋な殿方がいらしたかと思えば…意外と真面目で素敵なお方ね。少しからかって差し上げようかしら…ふふ）`,
  mood: 'neutral',
  tsunRatio: 75,
  reactionAction: '白いピンヒールを優美に響かせてカウンターに腰掛け、サファイアブルーの瞳でじっと見つめる',
  timestamp: '21:00',
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('salon_emma_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [INITIAL_MESSAGE];
  });

  const [affinity, setAffinity] = useState<number>(() => {
    const saved = localStorage.getItem('salon_emma_affinity');
    return saved ? Number(saved) : 25;
  });

  const [mood, setMood] = useState<EmmaMood>('neutral');
  const [tsunRatio, setTsunRatio] = useState<number>(70);
  const [latestAction, setLatestAction] = useState<string>(INITIAL_MESSAGE.reactionAction || '');
  const [latestInnerThought, setLatestInnerThought] = useState<string>(INITIAL_MESSAGE.innerThought || '');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Audio settings
  const [bgmActive, setBgmActive] = useState<boolean>(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('ai'); // Default to high-fidelity Gemini AI neural voice
  const [aiVoice, setAiVoice] = useState<string>('Kore');
  const [soundFxActive, setSoundFxActive] = useState<boolean>(true);

  // Modals
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState<boolean>(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState<boolean>(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Subscribe to speaking state
  useEffect(() => {
    const unsubscribe = loungeAudio.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('salon_emma_messages', JSON.stringify(messages));
    localStorage.setItem('salon_emma_affinity', String(affinity));
  }, [messages, affinity]);

  // Handle BGM toggle
  const handleToggleBgm = () => {
    const nextState = !bgmActive;
    setBgmActive(nextState);
    loungeAudio.toggleBgm(nextState);
  };

  const handleToggleSoundFx = () => {
    setSoundFxActive(!soundFxActive);
  };

  // Reset conversation
  const handleReset = () => {
    if (window.confirm('銀座の夜をやり直しますか？ 会話履歴と好感度がリセットされます。')) {
      setMessages([INITIAL_MESSAGE]);
      setAffinity(25);
      setMood('neutral');
      setTsunRatio(70);
      setLatestAction(INITIAL_MESSAGE.reactionAction || '');
      setLatestInnerThought(INITIAL_MESSAGE.innerThought || '');
      localStorage.removeItem('salon_emma_messages');
      localStorage.removeItem('salon_emma_affinity');
      loungeAudio.stopSpeech();
    }
  };

  // Send message to Emma
  const handleSendMessage = async (text: string, drinkName?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr,
      drinkName,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    if (soundFxActive) {
      if (drinkName) {
        loungeAudio.playChampagnePop();
        setTimeout(() => loungeAudio.playGlassClink(), 300);
      } else {
        loungeAudio.playSoftChime();
      }
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8),
          currentAffinity: affinity,
          drinkOrder: drinkName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const emmaMsg: ChatMessage = {
          id: `emma-${Date.now()}`,
          sender: 'emma',
          text: data.reply,
          innerThought: data.innerThought,
          mood: data.mood || 'neutral',
          tsunRatio: data.tsunRatio ?? 60,
          reactionAction: data.reactionAction,
          timestamp: timeStr,
        };

        setMessages((prev) => [...prev, emmaMsg]);
        setAffinity(data.affinity ?? affinity);
        setMood(data.mood || 'neutral');
        setTsunRatio(data.tsunRatio ?? 60);
        if (data.reactionAction) setLatestAction(data.reactionAction);
        if (data.innerThought) setLatestInnerThought(data.innerThought);

        // Speak response with Neural AI voice or selected mode
        if (voiceMode !== 'off') {
          loungeAudio.speak(data.reply, data.mood);
        }
      }
    } catch (err) {
      console.error('Failed to communicate with Emma:', err);
    } finally {
      setIsThinking(false);
    }
  };

  // Order Drink handler
  const handleOrderDrink = (drink: DrinkItem) => {
    handleSendMessage(`「${drink.name}」をエマと一緒に楽しみたいんだ。乾杯しよう。`, drink.name);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-amber-50 flex flex-col selection:bg-amber-600/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        affinity={affinity}
        bgmActive={bgmActive}
        onToggleBgm={handleToggleBgm}
        voiceMode={voiceMode}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        soundFxActive={soundFxActive}
        onToggleSoundFx={handleToggleSoundFx}
        onReset={handleReset}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
        isSpeaking={isSpeaking}
      />

      {/* Main Lounge Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Emma's Visual Presence & Status */}
        <div className="lg:col-span-5 h-[520px] lg:h-[calc(100vh-90px)] min-h-[500px]">
          <EmmaStage
            mood={mood}
            tsunRatio={tsunRatio}
            affinity={affinity}
            latestAction={latestAction}
            latestInnerThought={latestInnerThought}
            isThinking={isThinking}
            isSpeaking={isSpeaking}
            onStopSpeech={() => loungeAudio.stopSpeech()}
            onOpenDrinkMenu={() => setIsDrinkModalOpen(true)}
            onOpenTopics={() => setIsTopicModalOpen(true)}
          />
        </div>

        {/* Right Column: Interactive Chat & Dialogue Stream */}
        <div className="lg:col-span-7 h-[540px] lg:h-[calc(100vh-90px)] min-h-[500px]">
          <ChatPanel
            messages={messages}
            onSendMessage={(text) => handleSendMessage(text)}
            isThinking={isThinking}
            onOpenDrinkMenu={() => setIsDrinkModalOpen(true)}
            onOpenTopics={() => setIsTopicModalOpen(true)}
            voiceActive={voiceMode !== 'off'}
          />
        </div>
      </main>

      {/* Modals */}
      <DrinkModal
        isOpen={isDrinkModalOpen}
        onClose={() => setIsDrinkModalOpen(false)}
        onOrderDrink={handleOrderDrink}
      />

      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onSelectTopic={(prompt) => handleSendMessage(prompt)}
      />

      <PersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
      />

      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voiceMode={voiceMode}
        onVoiceModeChange={(mode) => setVoiceMode(mode)}
        aiVoice={aiVoice}
        onAiVoiceChange={(v) => setAiVoice(v)}
      />
    </div>
  );
}
