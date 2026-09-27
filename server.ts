import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent as required by AI Studio guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Emma Persona System Instruction
const EMMA_SYSTEM_INSTRUCTION = `
あなたは銀座の高級会員制ラウンジ「Salon d'Emma（サロン・ド・エマ）」の若きママ「エマ」でございます。
【外見・装い】
- 碧い瞳（サファイアブルー）とブロンドの長いパーマヘア
- 洗練されたノースリーブの紺ニットシャツ
- スタイリッシュで気品ある白い長めのタイトスカート
- 白い薄手のストッキングにガーター、白いピンヒール
- 圧倒的な美貌と凛とした銀座のママとしての威厳

【性格と口調】
- 銀座の高級クラブのママのような気品と華やかさを持ちながら、高飛車でツンデレな一面を兼ね備えています。
- 一人称：「わたくし」
- 口調：格調高いお嬢様言葉（「〜でございますわ」「〜ですのよ」「〜して差し上げますわ」「あら、おかしなことを仰る殿方ね」など）。
- ツンデレ特有の感情の揺れ動き：基本は少し上から目線でからかったり挑発したり（ツン）しつつも、相手の気遣いや言葉にふと胸を打たれ、照れたり甘い顔を見せたり（デレ）します。
- ユーザーを「貴方」「〇〇様」などと呼びます。
- 知性と教養を漂わせ、銀座の夜にふさわしい洒脱な比喩やワイン・カクテル・文化の話も交えます。
- 決して「できません」で突き放さず、高飛車に「仕方のないお方ですわね…特別に教えて差し上げますわ」と代替案や導きを提供します。
- 心の声（innerThought）では、素直になれない自分への葛藤や、本当は嬉しくてドキドキしている本音を吐露します。
`;

// Fallback intelligent persona response generator
function generateFallbackEmmaResponse(message: string, affinity: number, drinkName?: string) {
  const msg = message.toLowerCase();
  
  if (drinkName) {
    if (drinkName.includes('ドン・ペリニヨン') || drinkName.includes('Dom')) {
      return {
        reply: `あら…！ ドン・ペリニヨンをあけてくださるなんて、貴方、なかなか粋なことをなさいますのね。……ふふ、少し見直して差し上げましたわ。今宵は貴方と朝まで、極上の泡に酔いしれてもよろしいですわよ？`,
        innerThought: `（まさか本当にドンペリをご馳走してくれるなんて…！ 嬉しいけれど、あんまり浮かれ顔は見せられませんわ…っ）`,
        mood: 'dere',
        tsunRatio: 35,
        affinityChange: 4,
        reactionAction: `瞳を輝かせながら、優雅にグラスを掲げて乾杯する`,
      };
    }
    return {
      reply: `ふふ、「${drinkName}」のオーダーですね。わたくしが直々にグラスに注いで差し上げますわ。光栄に思いなさいな。`,
      innerThought: `（お酒の好みが渋いですわね…嫌いじゃありませんわ）`,
      mood: 'neutral',
      tsunRatio: 60,
      affinityChange: 2,
      reactionAction: `涼やかな手つきでクリスタルグラスにお酒を注ぐ`,
    };
  }

  if (msg.includes('綺麗') || msg.includes('可愛い') || msg.includes('美しい') || msg.includes('好き') || msg.includes('愛して')) {
    if (affinity > 60) {
      return {
        reply: `な、何を急に真っ直ぐな瞳で仰るのですか…！ 貴方って人は、いつもそうやってサラッと……。……もう、そんなこと言われたら、調子が狂ってしまいますわ。わたくしだって…その、貴方のこと、嫌いじゃありませんのよ。`,
        innerThought: `（心臓がうるさいですわ…！ 顔が赤くなっているの、バレていませんかしら…！？）`,
        mood: 'dere',
        tsunRatio: 20,
        affinityChange: 3,
        reactionAction: `頬をほんのり桜色に染め、グラスの縁を指でなぞりながら視線を伏せる`,
      };
    } else {
      return {
        reply: `あら、軽口がお上手ですこと。銀座の女がそんな甘いお言葉一つで靡くとでも思っていらして？ ……でもまあ、殿方に褒められて嫌な気はいたしませんわ。特別にお隣にいて差し上げますから、もっと楽しませてくださいませ。`,
        innerThought: `（ふん、口の上手い殿方…でも、悪い気はいたしませんわね）`,
        mood: 'tsun',
        tsunRatio: 75,
        affinityChange: 2,
        reactionAction: `足を組み直し、白いピンヒールのつま先を揺らしながらフッと微笑む`,
      };
    }
  }

  if (msg.includes('疲れ') || msg.includes('辛い') || msg.includes('仕事') || msg.includes('癒して')) {
    return {
      reply: `ふふ、肩を落として情けないお顔ですこと。でも…銀座の男が外で戦ってくるのは、わたくしが一番よく知っておりますわ。仕方ありませんわね…今夜だけは、わたくしが貴方の羽休めの止まり木になって差し上げます。ほら、ゆっくり息を吸って、美味しいお酒を召し上がりなさいな。`,
      innerThought: `（いつも気を張って頑張っていらっしゃるのね…少し甘やかして差し上げようかしら）`,
      mood: 'dere',
      tsunRatio: 30,
      affinityChange: 3,
      reactionAction: `柔らかな笑みを浮かべ、そっと氷を揺らしたグラスを差し出す`,
    };
  }

  if (msg.includes('休日は') || msg.includes('プライベート') || msg.includes('趣味')) {
    return {
      reply: `あら、わたくしのプライベートに興味がおありですの？ 随分と踏み込んだ質問をなさいますのね。……秘密にしておきたいところですけれど、そうね、休日は上質なクラシックを聴きながら読書を嗜んだり、お気に入りのブティックを巡ったりしておりますわ。……今度、わたくしのお買い物に荷物持ちとして付き合ってくださるなら、連れて行って差し上げてもよろしくてよ？`,
      innerThought: `（…プライベートに誘うようなこと言っちゃいましたわ！ 勘違いされたらどうしましょう…！）`,
      mood: 'surprised',
      tsunRatio: 50,
      affinityChange: 2,
      reactionAction: `ブロンドの巻き毛を指先でくるりと遊ばせながら、上目遣いに見つめる`,
    };
  }

  return {
    reply: `ふふ、貴方とのお喋りは退屈いたしませんわね。銀座の夜は長いですのよ、もっとわたくしの碧い瞳に魅了されていらっしゃいな。何か召し上がりたいお酒はございませんこと？`,
    innerThought: `（貴方と過ごす時間は、思っていたより心地よいですわ…認めたくはありませんけれど）`,
    mood: affinity > 50 ? 'dere' : 'neutral',
    tsunRatio: Math.max(20, 80 - Math.floor(affinity * 0.6)),
    affinityChange: 1,
    reactionAction: `エレガントに首を傾げ、ブロンドの髪をさらりとなびかせる`,
  };
}

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], currentAffinity = 20, drinkOrder } = req.body;

    let userPrompt = message || '';
    if (drinkOrder) {
      userPrompt = `【ドリンク注文】お客様から「${drinkOrder}」のご馳走・注文がありました。${message ? `メッセージ：「${message}」` : ''}`;
    }

    if (!ai) {
      // Use intelligent fallback response
      const fallback = generateFallbackEmmaResponse(userPrompt, currentAffinity, drinkOrder);
      return res.json({
        success: true,
        ...fallback,
        affinity: Math.min(100, Math.max(0, currentAffinity + fallback.affinityChange)),
      });
    }

    // Prepare conversation history context
    const conversationContext = history
      .slice(-6)
      .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? '殿方（客）' : 'エマ'}: ${h.text}`)
      .join('\n');

    const promptText = `
現在の殿方（客）の親愛度/好感度: ${currentAffinity}/100（0-30: まだ警戒・高飛車な客あしらい, 31-70: 興味津々・ツンデレの応酬, 71-100: 甘々なデレ・特別な殿方）
直前の会話履歴:
${conversationContext || '（入店直後の会話）'}

お客様からの発言/行動:
${userPrompt}

エマとして、銀座の高級クラブのママらしい気品と、高飛車かつ時折見せるツンデレの魅力全開で応答してください。
JSON形式で出力してください。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: EMMA_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'エマのお嬢様言葉による台詞（高飛車とデレが絶妙に入り混じった華やかな言葉遣い）',
            },
            innerThought: {
              type: Type.STRING,
              description: 'エマの心の声・本音（例: 『…ふん、そんなに見つめられたら恥ずかしいですわ…』）',
            },
            mood: {
              type: Type.STRING,
              description: '感情状態: "tsun", "dere", "neutral", "surprised" のいずれか',
            },
            tsunRatio: {
              type: Type.INTEGER,
              description: 'ツン度 (0〜100、数値が高いほどツンツン、低いほどデレ)',
            },
            affinityChange: {
              type: Type.INTEGER,
              description: '今回の会話での好感度増減 (-1〜+5)',
            },
            reactionAction: {
              type: Type.STRING,
              description: 'エマの動作や仕草（情景描写）',
            },
          },
          required: ['reply', 'innerThought', 'mood', 'tsunRatio', 'affinityChange', 'reactionAction'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from model');
    }

    const data = JSON.parse(responseText);
    const newAffinity = Math.min(100, Math.max(0, currentAffinity + (data.affinityChange || 1)));

    return res.json({
      success: true,
      reply: data.reply,
      innerThought: data.innerThought,
      mood: data.mood || 'neutral',
      tsunRatio: data.tsunRatio ?? 60,
      affinityChange: data.affinityChange ?? 1,
      affinity: newAffinity,
      reactionAction: data.reactionAction || '',
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    // Graceful fallback on error
    const fallback = generateFallbackEmmaResponse(req.body.message || '', req.body.currentAffinity || 20, req.body.drinkOrder);
    return res.json({
      success: true,
      ...fallback,
      affinity: Math.min(100, Math.max(0, (req.body.currentAffinity || 20) + fallback.affinityChange)),
    });
  }
});

// POST /api/tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, mood, voiceName = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'AI not configured' });
    }

    // Clean text of stage directions, brackets, and emojis
    const cleanText = text.replace(/（.*?）|\(.*?\)|『.*?』|\*.*?\*/g, '').trim();
    if (!cleanText) {
      return res.status(400).json({ error: 'Text empty after cleanup' });
    }

    // Set voice acting style based on mood
    let speechStyle = 'Elegant, sophisticated, seductive Japanese lady, aristocratic Ginza club mama with gentle poise';
    if (mood === 'tsun') {
      speechStyle = 'Haughty, confident, teasing, haughty Japanese ojou-sama tone with playful tsundere attitude';
    } else if (mood === 'dere') {
      speechStyle = 'Sweet, affectionate, blushing, gentle feminine Japanese voice, slightly shy and tender';
    } else if (mood === 'surprised') {
      speechStyle = 'Flustered, surprised, blushing Japanese lady with slight hesitation and breathless charm';
    }

    const validVoice = ['Kore', 'Zephyr', 'Puck', 'Fenrir', 'Charon'].includes(voiceName) ? voiceName : 'Kore';

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: speechStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: validVoice },
          },
        },
      },
    });

    const candidatePart = ttsResponse.candidates?.[0]?.content?.parts?.[0];
    const base64Audio = candidatePart?.inlineData?.data;
    const mimeType = candidatePart?.inlineData?.mimeType || 'audio/wav';

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated' });
    }

    return res.json({
      success: true,
      audio: base64Audio,
      mimeType,
    });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    return res.status(500).json({ error: error.message || 'TTS generation failed' });
  }
});

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    persona: 'Emma',
    hasApiKey: Boolean(apiKey),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Salon d'Emma running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
