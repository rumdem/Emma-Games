import { DrinkItem, VIPRank } from '../types';

export const DRINKS_MENU: DrinkItem[] = [
  {
    id: 'dom-perignon',
    name: 'ドン・ペリニヨン ヴィンテージ',
    frenchName: 'Dom Pérignon Vintage',
    category: 'champagne',
    price: '¥85,000',
    description: 'プレステージ・シャンパーニュの最高峰。華やかな泡立ちと熟成香がエマの心を解きほぐします。',
    icon: '🍾',
    effect: '好感度超絶UP ＆ エマのデレ度急上昇',
    isSpecial: true,
  },
  {
    id: 'krug',
    name: 'クリュッグ グラン・キュヴェ',
    frenchName: 'Krug Grande Cuvée',
    category: 'champagne',
    price: '¥110,000',
    description: '「シャンパーニュの帝王」と称される圧巻の芳醇さ。銀座の夜に相応しい至高の逸品。',
    icon: '🥂',
    effect: '好感度大幅UP ＆ エマの特別なおもてなし',
    isSpecial: true,
  },
  {
    id: 'bleu-saphir',
    name: 'エマ特製カクテル「ブルー・サファイア」',
    frenchName: 'Bleu Saphir Signature',
    category: 'cocktail',
    price: '¥18,000',
    description: 'エマの碧い瞳をモチーフにしたサロン限定カクテル。すっきりとしたプレミアムジンと柑橘の煌めき。',
    icon: '🍸',
    effect: 'エマの視線独占 ＆ 照れ隠しの微笑み',
  },
  {
    id: 'yamazaki-18',
    name: '山崎 18年 ロック',
    frenchName: 'The Yamazaki 18 Years Single Malt',
    category: 'whisky',
    price: '¥48,000',
    description: '深みのあるシェリー樽熟成香。知的で落ち着いた大人の会話を楽しむための銘酒。',
    icon: '🥃',
    effect: '知的な銀座トーク ＆ 親密なムード',
  },
  {
    id: 'royal-tea',
    name: 'ロイヤル・マリアージュ アールグレイ',
    frenchName: 'Mariage Frères Earl Grey Impérial',
    category: 'non-alcoholic',
    price: '¥6,000',
    description: '高貴なベルガモットが香る名門の紅茶。お酒を召し上がらない殿方にも至福の安らぎを。',
    icon: '☕',
    effect: '穏やかな歓談 ＆ 心温まる癒し',
  },
];

export const VIP_RANKS: VIPRank[] = [
  {
    name: '一見のお客様',
    minAffinity: 0,
    title: 'First-time Guest',
    badgeColor: 'from-zinc-500 to-zinc-700 text-zinc-200 border-zinc-500/30',
    benefit: '高飛車で警戒心のあるエマのおもてなし',
  },
  {
    name: '気になる殿方',
    minAffinity: 30,
    title: 'Intrigued Guest',
    badgeColor: 'from-amber-700 to-amber-900 text-amber-200 border-amber-500/40',
    benefit: 'からかい交じりの軽妙なツンデレトーク解禁',
  },
  {
    name: '銀座のVIP常連様',
    minAffinity: 60,
    title: 'VIP Regular Patron',
    badgeColor: 'from-amber-500 to-yellow-600 text-yellow-100 border-yellow-400/50',
    benefit: 'エマの甘い素顔と時折こぼれる本音が聴ける',
  },
  {
    name: 'エマの最愛の殿方',
    minAffinity: 85,
    title: 'Emma\'s Beloved Patron',
    badgeColor: 'from-rose-500 to-pink-600 text-pink-100 border-rose-400/50 shadow-rose-900/50',
    benefit: '独占欲を滲ませるデレ全開の至高のひととき',
  },
];

export const TOPIC_SUGGESTIONS = [
  {
    title: '装いを褒める',
    prompt: 'エマ、今夜のノースリーブのニットとタイトスカート、そしてサファイアブルーの瞳…息を呑むほど美しいね。',
    icon: '✨',
  },
  {
    title: 'おすすめのお酒',
    prompt: 'エマ、今夜の気分にぴったりの特別なお酒をわたくしに選んでくださらないか？',
    icon: '🍾',
  },
  {
    title: '銀座ママの苦労',
    prompt: '銀座のクラブのママとして、普段どんな思いでお店を守っているの？ エマの覚悟を聞かせてほしいな。',
    icon: '💎',
  },
  {
    title: '休日の過ごし方',
    prompt: 'エマのプライベートな休日はどう過ごしているの？ 今度二人で出かけないかい？',
    icon: '☕',
  },
  {
    title: '甘えてみる',
    prompt: '今夜は仕事で少し疲れてしまってね…エマの声を聞いて、癒されたいんだ。',
    icon: '🌙',
  },
  {
    title: '口説いてみる',
    prompt: '銀座のナンバーワンのママを、本気で口説き落としたくなったらどうすればいい？',
    icon: '💋',
  },
];
