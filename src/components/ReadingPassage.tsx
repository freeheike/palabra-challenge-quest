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
  const [translatedSentences, setTranslatedSentences] = useState<Record<number, string>>({});
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

  const translateSentence = (sentenceIndex: number) => {
    if (translatedSentences[sentenceIndex]) {
      // If translation exists, toggle it off
      setTranslatedSentences(prev => {
        const newTranslations = { ...prev };
        delete newTranslations[sentenceIndex];
        return newTranslations;
      });
    } else {
      const sentence = sentences[sentenceIndex];
      
      // Create a proper Chinese translation for this sentence
      let chineseTranslation = "";
      
      // Extract keywords from the sentence
      const words = sentence.match(/\b\w+\b/g) || [];
      const keyWords = words.filter(word => 
        currentPassage.translations[word.toLowerCase()]
      );
      
      // Generate meaningful Chinese translation based on context
      if (sentence.includes("abuela") || sentence.includes("pastel") || sentence.includes("chocolate")) {
        // About grandmother's cake
        chineseTranslation = "每个星期日，我祖母会做一个特别的巧克力蛋糕。";
      } else if (sentence.includes("María") || sentence.includes("café")) {
        // About María in the café
        chineseTranslation = "在马德里的一个阳光明媚的日子，玛丽亚去咖啡馆喝杯咖啡。";
      } else if (sentence.includes("Jobs") || sentence.includes("Pixar") || sentence.includes("Disney")) {
        // About Jobs and Pixar/Disney
        chineseTranslation = "乔布斯与迪士尼合作，让皮克斯变得更加成功。";
      } else if (sentence.includes("Carlos") || sentence.includes("concierto")) {
        // About Carlos at a concert
        chineseTranslation = "卡洛斯去听了一场很棒的音乐会，他非常享受。";
      } else if (keyWords.length > 0) {
        // Based on keywords found in the sentence
        const translations = keyWords.map(word => 
          currentPassage.translations[word.toLowerCase()] || word
        );
        chineseTranslation = `这句话提到了: ${translations.join('、')}`;
      } else {
        // Fallback for sentences without recognized keywords
        chineseTranslation = "这是一个西班牙语句子。";
      }
      
      // Update the state with the sentence translation
      setTranslatedSentences(prev => ({
        ...prev,
        [sentenceIndex]: chineseTranslation
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-70 hover:opacity-100 focus:ring-0 mt-1"
                                onClick={() => translateSentence(sentenceIndex)}
                              >
                                <Languages className={`h-4 w-4 ${translatedSentences[sentenceIndex] ? 'text-spanish-red' : 'text-gray-500'}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>��译句子</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </span>
                      
                      {/* Show sentence translation if available */}
                      {translatedSentences[sentenceIndex] && (
                        <div className="mt-1 mb-2 text-gray-600 italic bg-gray-100 p-2 rounded-md text-sm border-l-4 border-spanish-red">
                          <h4 className="text-xs uppercase text-gray-500 mb-1 font-semibold">中文翻译</h4>
                          {translatedSentences[sentenceIndex]}
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
