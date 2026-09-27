export type EmmaMood = 'tsun' | 'dere' | 'neutral' | 'surprised';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'emma';
  text: string;
  innerThought?: string;
  mood?: EmmaMood;
  tsunRatio?: number;
  reactionAction?: string;
  timestamp: string;
  drinkName?: string;
}

export interface DrinkItem {
  id: string;
  name: string;
  frenchName: string;
  category: 'champagne' | 'cocktail' | 'whisky' | 'non-alcoholic';
  price: string;
  description: string;
  icon: string;
  effect: string;
  isSpecial?: boolean;
}

export interface VIPRank {
  name: string;
  minAffinity: number;
  title: string;
  badgeColor: string;
  benefit: string;
}
