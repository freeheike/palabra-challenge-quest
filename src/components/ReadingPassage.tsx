
import React, { useState, useEffect, useRef } from 'react';
import ClickableWord from './ClickableWord';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Volume2, Languages } from 'lucide-react';
import { AZURE_CONFIG } from '@/constants/game';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const japaneseToRomaji = (text: string): string => {
  const mappings: Record<string, string> = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
    '私': 'watashi', '今日': 'kyou', '明日': 'ashita',
    '昨日': 'kinou', '東京': 'toukyou', '大阪': 'oosaka',
    '先生': 'sensei', '学生': 'gakusei', '友達': 'tomodachi',
    '電車': 'densha', '新幹線': 'shinkansen', '駅': 'eki',
    '映画': 'eiga', '音楽': 'ongaku', '本': 'hon',
    '猫': 'neko', '犬': 'inu', '魚': 'sakana',
    '水': 'mizu', '食べる': 'taberu', '飲む': 'nomu',
    '行く': 'iku', '来る': 'kuru', '見る': 'miru',
    '聞く': 'kiku', '話す': 'hanasu', '読む': 'yomu',
    '書く': 'kaku', '買う': 'kau', '売る': 'uru',
    '教える': 'oshieru', '覚える': 'oboeru', '忘れる': 'wasureru',
    '始める': 'hajimeru', '終わる': 'owaru', '帰る': 'kaeru',
    '入る': 'hairu', '出る': 'deru', '作る': 'tsukuru',
    '使う': 'tsukau', '待つ': 'matsu', '休む': 'yasumu',
    'おはよう': 'ohayou', 'こんにちは': 'konnichiwa', 'こんばんは': 'konbanwa',
    'さようなら': 'sayounara', 'ありがとう': 'arigatou', 'すみません': 'sumimasen',
    'はい': 'hai', 'いいえ': 'iie', 'お願いします': 'onegaishimasu',
    '失礼します': 'shitsurei shimasu', 'お元気ですか': 'ogenki desu ka', 'だいじょうぶです': 'daijoubu desu',
    '大丈夫': 'daijoubu', '元気': 'genki', '好き': 'suki',
    '嫌い': 'kirai', '美味しい': 'oishii', '美しい': 'utsukushii',
    '高い': 'takai', '安い': 'yasui', '面白い': 'omoshiroi',
    '楽しい': 'tanoshii', '難しい': 'muzukashii', '簡単': 'kantan',
    '忙しい': 'isogashii', '暑い': 'atsui', '寒い': 'samui',
    '暖かい': 'atatakai', '涼しい': 'suzushii', '雨': 'ame',
    '雪': 'yuki', '風': 'kaze', '太陽': 'taiyou',
    'おばあちゃん': 'obaachan', 'レシピ': 'reshipi', '毎週': 'maishuu', '日曜日': 'nichiyoubi',
    '特別': 'tokubetsu', 'チョコレート': 'chokoreeto', 'ケーキ': 'keeki', 
    '大きな': 'ookina', 'ボウル': 'bouru', '小麦粉': 'komugiko', '砂糖': 'satou', 'ココア': 'kokoa',
    '混ぜました': 'mazemashita', '次に': 'tsugi ni', '新鮮な': 'shinsen na', '卵': 'tamago', '少し': 'sukoshi',
    '牛乳': 'gyuunyuu', '加えました': 'kuwaemashita', '滑らかな': 'nameraka na', '混合物': 'kongoubutsu',
    'なるまで': 'naru made', '全て': 'subete', '秘密': 'himitsu', 'シナモン': 'shinamon',
    'バニラ': 'banira', '数滴': 'suuteki', '注ぎ': 'sosogi', '形': 'kata', 'オーブン': 'oobun',
    '分間': 'funkan', '待っている': 'matte iru', '若い頃': 'wakai koro', '話': 'hanashi', 
    '甘い': 'amai', '香り': 'kaori', '広がり': 'hirogari', '家中': 'iejuu', '口': 'kuchi',
    'させました': 'sasemashita', '完成': 'kansei', '冷ました': 'samashita', '前に': 'mae ni',
    'かける': 'kakeru', 'アイシング': 'aishingu', 'いつも': 'itsumo', 
    'フルーツ': 'furuutsu', '共有': 'kyouyuu', '時間': 'jikan', '部分': 'bubun',
    'お気に入り': 'okiniiri', '週': 'shuu',
    '作っていました': 'tsukutte imashita',
    '話してくれました': 'hanashite kuremashita',
    '飾り付けました': 'kazaritsukemashita'
  };

  let romaji = "";
  let i = 0;
  
  while (i < text.length) {
    let matched = false;
    
    for (let len = 4; len > 0; len--) {
      if (i + len <= text.length) {
        const substr = text.substring(i, i + len);
        if (mappings[substr]) {
          romaji += mappings[substr] + " ";
          i += len;
          matched = true;
          break;
        }
      }
    }
    
    if (!matched) {
      romaji += text[i];
      i++;
    }
  }
  
  return romaji.trim();
};

const splitJapaneseIntoWords = (text: string): string[] => {
  const spacedText = text.replace(/([一-龯])([ぁ-んァ-ン])/g, '$1 $2')
                         .replace(/([ぁ-んァ-ン])([一-龯])/g, '$1 $2')
                         .replace(/([、。！？])/g, ' $1 ');
  
  return spacedText.split(/\s+/).filter(word => word.length > 0);
};

const ReadingPassage: React.FC = () => {
  const { currentPassage, currentLanguage, highlightedSentenceIndex } = useGame();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedSentences, setDisplayedSentences] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [translatedSentences, setTranslatedSentences] = useState<Record<number, boolean>>({});
  const highlightedSentenceRef = useRef<HTMLSpanElement>(null);
  
  if (!currentPassage) {
    return <div>Loading passage...</div>;
  }
  
  const sentences = currentPassage.text.split(/(?<=[.!?。])\s*/);
  
  const paragraphs = currentPassage.text.split(/\n\n+/);
  
  const handleReadNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      setDisplayedSentences([...displayedSentences, nextIndex]);
    }
  };
  
  const speakSentence = async (sentenceIndex: number) => {
    try {
      setIsPlaying(sentenceIndex);
      
      let sentence = sentences[sentenceIndex];
      
      let voiceName = 'es-ES-AlvaroNeural';
      let langCode = 'es-ES';
      
      if (currentLanguage === 'japanese') {
        voiceName = 'ja-JP-NanamiNeural';
        langCode = 'ja-JP';
      }
      
      const speechSynthesisRequestOptions = {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_CONFIG.apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: `<speak version='1.0' xml:lang='${langCode}'><voice xml:lang='${langCode}' name='${voiceName}'>${sentence}</voice></speak>`
      };

      const response = await fetch(AZURE_CONFIG.ttsUrl, speechSynthesisRequestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(null);
    }
  };

  const toggleTranslation = (sentenceIndex: number) => {
    setTranslatedSentences(prev => ({
      ...prev,
      [sentenceIndex]: !prev[sentenceIndex]
    }));
  };

  useEffect(() => {
    if (displayedSentences.length > 0) {
      const lastSentenceIndex = displayedSentences[displayedSentences.length - 1];
      speakSentence(lastSentenceIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedSentences.length]);

  useEffect(() => {
    if (highlightedSentenceIndex !== null && highlightedSentenceRef.current) {
      highlightedSentenceRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [highlightedSentenceIndex]);

  const getDisplayedParagraphs = () => {
    const displayedText = displayedSentences.map(index => sentences[index]).join(' ');
    return displayedText.split(/\n\n+/);
  };

  const displayedParagraphs = getDisplayedParagraphs();

  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold text-spanish-text mb-4">{currentPassage.title}</h2>
      
      <div className="text-lg leading-relaxed bg-spanish-background p-6 rounded-lg shadow-md min-h-[200px] max-h-[500px] overflow-y-auto">
        {paragraphs.map((paragraph, paragraphIndex) => {
          if (!displayedSentences.some(sentIndex => {
            const sentenceText = sentences[sentIndex];
            return paragraph.includes(sentenceText);
          })) {
            return null;
          }
          
          const paragraphSentences = sentences.filter(sentence => 
            paragraph.includes(sentence)
          );
          
          const paragraphSentenceIndexes = paragraphSentences.map(sentence => 
            sentences.indexOf(sentence)
          );
          
          const visibleSentenceIndexes = paragraphSentenceIndexes.filter(index => 
            displayedSentences.includes(index)
          );
          
          if (visibleSentenceIndexes.length === 0) {
            return null;
          }
          
          return (
            <div key={paragraphIndex} className="mb-6 last:mb-0 relative">
              <div>
                {visibleSentenceIndexes.map((sentenceIndex) => {
                  const sentence = sentences[sentenceIndex];
                  
                  return (
                    <div key={sentenceIndex} className="mb-4 last:mb-0">
                      <span 
                        className={`flex items-start group ${highlightedSentenceIndex === sentenceIndex ? 'bg-yellow-100 -mx-2 px-2 py-1 rounded-md' : ''}`}
                        ref={highlightedSentenceIndex === sentenceIndex ? highlightedSentenceRef : null}
                      >
                        <span className="flex-grow">
                          {currentLanguage === 'japanese' ? (
                            <div className="flex flex-col mb-2">
                              <div>
                                {splitJapaneseIntoWords(sentence).map((word, wordIndex) => {
                                  if (/^[、。！？]$/.test(word)) {
                                    return <span key={`${sentenceIndex}-${wordIndex}`}>{word}</span>;
                                  }
                                  
                                  return (
                                    <ClickableWord 
                                      key={`${sentenceIndex}-${wordIndex}`}
                                      word={word.toLowerCase().replace(/[.,;:!?'"()]/g, '')}
                                      originalWord={word}
                                    />
                                  );
                                })}
                              </div>
                              {currentPassage.sentenceRomaji && currentPassage.sentenceRomaji[sentenceIndex] && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {currentPassage.sentenceRomaji[sentenceIndex]}
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              {sentence.split(/\s+/).map((word, wordIndex) => {
                                if (/^\s+$/.test(word)) {
                                  return <span key={`${sentenceIndex}-${wordIndex}`}>{word}</span>;
                                }
                                
                                return (
                                  <ClickableWord 
                                    key={`${sentenceIndex}-${wordIndex}`}
                                    word={word.toLowerCase().replace(/[.,;:!?'"()]/g, '')}
                                    originalWord={word}
                                  />
                                );
                              })}
                            </>
                          )}
                        </span>
                        
                        <div className="flex items-center ml-1 space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-70 hover:opacity-100 h-6 w-6 mt-1 focus:ring-0" 
                            onClick={() => speakSentence(sentenceIndex)}
                            disabled={isPlaying !== null}
                          >
                            <Volume2 
                              className={`h-4 w-4 ${isPlaying === sentenceIndex ? 'text-spanish-red animate-pulse' : 'text-spanish-text'}`} 
                            />
                          </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 opacity-70 hover:opacity-100 focus:ring-0 mt-1"
                                  onClick={() => toggleTranslation(sentenceIndex)}
                                >
                                  <Languages className={`h-4 w-4 ${translatedSentences[sentenceIndex] ? 'text-spanish-red' : 'text-gray-500'}`} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>翻译句子</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </span>
                      
                      {translatedSentences[sentenceIndex] && currentPassage.sentenceTranslations && currentPassage.sentenceTranslations[sentenceIndex] && (
                        <div className="mt-1 mb-2 text-gray-600 italic bg-gray-100 p-2 rounded-md text-sm border-l-4 border-spanish-red">
                          <h4 className="text-xs uppercase text-gray-500 mb-1 font-semibold">中文翻译</h4>
                          {currentPassage.sentenceTranslations[sentenceIndex]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Sentence {currentSentenceIndex + 1} of {sentences.length}
        </span>
        <div className="flex gap-2">
          {currentSentenceIndex < sentences.length - 1 && (
            <Button 
              onClick={handleReadNext} 
              className="bg-spanish-red hover:bg-spanish-red/90"
            >
              Read Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingPassage;
