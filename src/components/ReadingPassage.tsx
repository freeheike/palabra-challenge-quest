
import React, { useState, useEffect } from 'react';
import ClickableWord from './ClickableWord';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Volume2 } from 'lucide-react';
import { AZURE_CONFIG } from '@/constants/game';

const ReadingPassage: React.FC = () => {
  const { currentPassage, currentLanguage } = useGame();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedSentences, setDisplayedSentences] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  
  if (!currentPassage) {
    return <div>Loading passage...</div>;
  }
  
  // Split the text into sentences
  const sentences = currentPassage.text.split(/(?<=[.!?])\s+/);
  
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
      
      const sentence = sentences[sentenceIndex];
      
      // Configure voice settings based on language
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

  // Auto-play the sentence when it appears
  useEffect(() => {
    if (displayedSentences.length > 0) {
      const lastSentenceIndex = displayedSentences[displayedSentences.length - 1];
      speakSentence(lastSentenceIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedSentences.length]); // Only re-run when displayedSentences changes
  
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold text-spanish-text mb-4">{currentPassage.title}</h2>
      
      <div className="text-lg leading-relaxed bg-spanish-background p-6 rounded-lg shadow-md min-h-[200px]">
        {displayedSentences.map((sentenceIndex) => {
          const sentence = sentences[sentenceIndex];
          // Split the sentence into words, preserving spaces and punctuation
          const words = sentence.match(/\S+|\s+/g) || [];
          
          return (
            <span key={sentenceIndex} className="flex items-start group">
              <span>
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-1 opacity-70 hover:opacity-100 h-6 w-6 mt-1 focus:ring-0" 
                onClick={() => speakSentence(sentenceIndex)}
                disabled={isPlaying !== null}
              >
                <Volume2 
                  className={`h-4 w-4 ${isPlaying === sentenceIndex ? 'text-spanish-red animate-pulse' : 'text-spanish-text'}`} 
                />
              </Button>
            </span>
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
