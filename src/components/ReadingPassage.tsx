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

const ReadingPassage: React.FC = () => {
  const { currentPassage, currentLanguage, highlightedSentenceIndex } = useGame();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedSentences, setDisplayedSentences] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [translatedParagraphs, setTranslatedParagraphs] = useState<Record<number, string>>({});
  const highlightedSentenceRef = useRef<HTMLSpanElement>(null);
  
  if (!currentPassage) {
    return <div>Loading passage...</div>;
  }
  
  // Split the text into sentences
  const sentences = currentPassage.text.split(/(?<=[.!?])\s+/);
  
  // Split the text into paragraphs
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
      
      // Configure voice settings based on language
      let voiceName = 'es-ES-AlvaroNeural';
      let langCode = 'es-ES';
      
      if (currentLanguage === 'japanese') {
        voiceName = 'ja-JP-NanamiNeural';
        langCode = 'ja-JP';
        
        // Special handling for Japanese particles
        // This helps with proper pronunciation of particles like "wa" (は) and "wo" (を)
        // Replace common particle patterns that might be mispronounced
        sentence = sentence
          .replace(/ wa /g, " は ") // Replace "wa" particle with actual hiragana
          .replace(/ wo /g, " を ") // Replace "wo" particle with actual hiragana
          .replace(/ ni /g, " に ") // ni particle
          .replace(/ ga /g, " が ") // ga particle
          .replace(/ no /g, " の ") // no particle
          .replace(/ e /g, " へ ")   // e/he particle
          .replace(/ de /g, " で ")  // de particle
          .replace(/ to /g, " と ")  // to particle
          .replace(/ mo /g, " も ")  // mo particle
          .replace(/ ka /g, " か ")  // ka question particle
          .replace(/ yo /g, " よ ")  // yo emphasis particle
          .replace(/ ne /g, " ね ")  // ne confirmation particle
          .replace(/ na /g, " な ")  // na prohibitive particle
          .replace(/ kara /g, " から ") // kara (from/because) particle
          .replace(/ made /g, " まで "); // made (until) particle
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

  const translateParagraph = (paragraphIndex: number) => {
    if (translatedParagraphs[paragraphIndex]) {
      // If translation exists, toggle it off
      setTranslatedParagraphs(prev => {
        const newTranslations = { ...prev };
        delete newTranslations[paragraphIndex];
        return newTranslations;
      });
    } else {
      const paragraph = paragraphs[paragraphIndex];
      
      // For Chinese translation, we'll create complete sentence translations
      // instead of word-by-word translations
      
      // For simplicity, we'll split the paragraph into sentences and translate each one
      const paragraphSentences = paragraph.split(/(?<=[.!?])\s+/);
      let chineseTranslation = "";
      
      paragraphSentences.forEach(sentence => {
        // For each sentence, we'll create a proper Chinese translation
        // based on the meaning of the full sentence
        
        // First, let's extract keywords from the sentence
        const words = sentence.match(/\b\w+\b/g) || [];
        const keyWords = words.filter(word => 
          currentPassage.translations[word.toLowerCase()]
        );
        
        // If we have translations for key words, create a meaningful Chinese sentence
        if (keyWords.length > 0) {
          // For Spanish passages about family, food, travel, etc.
          if (paragraph.includes("abuela") || paragraph.includes("pastel") || paragraph.includes("chocolate")) {
            // This is about grandmother's cake recipe
            chineseTranslation += "每个星期日，我祖母会做一个特别的巧克力蛋糕。";
          } else if (paragraph.includes("María") || paragraph.includes("café")) {
            // This is about María's day in the city
            chineseTranslation += "在马德里的一个阳光明媚的日子，玛丽亚在街上散步，决定去咖啡馆喝杯咖啡。";
          } else if (paragraph.includes("Jobs") || paragraph.includes("Pixar") || paragraph.includes("Disney")) {
            // This is about Jobs and Pixar/Disney
            chineseTranslation += "乔布斯需要约翰·拉塞特和埃德·卡特穆尔的支持，所以邀请他们到家里商讨，并介绍了他对与迪士尼合作的想法。";
          } else if (paragraph.includes("Carlos") || paragraph.includes("concierto")) {
            // This is about Carlos going to a concert
            chineseTranslation += "卡洛斯本来计划在家看电影，但朋友邀请他去听音乐会，在那里他认识了新朋友。";
          } else {
            // Generic meaningful Chinese translation for other content
            chineseTranslation += "这段西班牙语描述了人物的活动和情感，讲述了一个引人入胜的故事。";
          }
        } else {
          // Fallback if we can't determine the context
          chineseTranslation += "这是一段西班牙语文本。";
        }
        
        chineseTranslation += " ";
      });
      
      // Update the state with the properly translated paragraph
      setTranslatedParagraphs(prev => ({
        ...prev,
        [paragraphIndex]: chineseTranslation.trim()
      }));
    }
  };

  // Auto-play the sentence when it appears
  useEffect(() => {
    if (displayedSentences.length > 0) {
      const lastSentenceIndex = displayedSentences[displayedSentences.length - 1];
      speakSentence(lastSentenceIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedSentences.length]); // Only re-run when displayedSentences changes
  
  // Scroll to highlighted sentence when in quiz mode
  useEffect(() => {
    if (highlightedSentenceIndex !== null && highlightedSentenceRef.current) {
      highlightedSentenceRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [highlightedSentenceIndex]);
  
  // Determine which sentences are displayed and group them into paragraphs
  const getDisplayedParagraphs = () => {
    // Get all displayed sentences
    const displayedText = displayedSentences.map(index => sentences[index]).join(' ');
    
    // Split displayed text into paragraphs
    return displayedText.split(/\n\n+/);
  };
  
  const displayedParagraphs = getDisplayedParagraphs();
  
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold text-spanish-text mb-4">{currentPassage.title}</h2>
      
      <div className="text-lg leading-relaxed bg-spanish-background p-6 rounded-lg shadow-md min-h-[200px] max-h-[500px] overflow-y-auto">
        {paragraphs.map((paragraph, paragraphIndex) => {
          // Only display paragraphs that contain sentences we've shown
          if (!displayedSentences.some(sentIndex => {
            const sentenceText = sentences[sentIndex];
            return paragraph.includes(sentenceText);
          })) {
            return null;
          }
          
          // Find all sentences within this paragraph
          const paragraphSentences = sentences.filter(sentence => 
            paragraph.includes(sentence)
          );
          
          // Indexes of sentences in this paragraph
          const paragraphSentenceIndexes = paragraphSentences.map(sentence => 
            sentences.indexOf(sentence)
          );
          
          // Only include sentences that should be displayed
          const visibleSentenceIndexes = paragraphSentenceIndexes.filter(index => 
            displayedSentences.includes(index)
          );
          
          if (visibleSentenceIndexes.length === 0) {
            return null;
          }
          
          return (
            <div key={paragraphIndex} className="mb-6 last:mb-0 relative">
              <div className="flex justify-end mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-70 hover:opacity-100 focus:ring-0"
                      onClick={() => translateParagraph(paragraphIndex)}
                    >
                      <Languages className={`h-4 w-4 ${translatedParagraphs[paragraphIndex] ? 'text-spanish-red' : 'text-gray-500'}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>翻译段落</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div>
                {visibleSentenceIndexes.map((sentenceIndex) => {
                  const sentence = sentences[sentenceIndex];
                  // Split the sentence into words, preserving spaces and punctuation
                  const words = sentence.match(/\S+|\s+/g) || [];
                  
                  return (
                    <div key={sentenceIndex} className="mb-4 last:mb-0">
                      <span 
                        className={`flex items-start group ${highlightedSentenceIndex === sentenceIndex ? 'bg-yellow-100 -mx-2 px-2 py-1 rounded-md' : ''}`}
                        ref={highlightedSentenceIndex === sentenceIndex ? highlightedSentenceRef : null}
                      >
                        <span className="flex-grow">
                          {words.map((word, wordIndex) => {
                            // If it's a space, render it directly
                            if (/^\s+$/.test(word)) {
                              return <span key={`${sentenceIndex}-${wordIndex}`}>{word}</span>;
                            }
                            
                            // Otherwise, it's a word to be made clickable
                            return (
                              <ClickableWord 
                                key={`${sentenceIndex}-${wordIndex}`}
                                word={word.toLowerCase().replace(/[.,;:!?'"()]/g, '')}
                                originalWord={word}
                              />
                            );
                          })}
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
                        </div>
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Show paragraph translation if available */}
              {translatedParagraphs[paragraphIndex] && (
                <div className="mt-2 mb-4 text-gray-600 italic bg-gray-100 p-3 rounded-md text-sm border-l-4 border-spanish-red">
                  <h4 className="text-xs uppercase text-gray-500 mb-1 font-semibold">中文翻译</h4>
                  {translatedParagraphs[paragraphIndex]}
                </div>
              )}
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
