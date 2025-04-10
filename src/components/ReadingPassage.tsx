import React, { useState } from 'react';
import ClickableWord from './ClickableWord';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

const ReadingPassage: React.FC = () => {
  const { currentPassage } = useGame();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedSentences, setDisplayedSentences] = useState<number[]>([0]);
  
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
  
  const handleShowMore = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      setDisplayedSentences([...displayedSentences, nextIndex]);
    }
  };
  
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold text-spanish-text mb-4">{currentPassage.title}</h2>
      
      <div className="text-lg leading-relaxed bg-spanish-background p-6 rounded-lg shadow-md min-h-[200px]">
        {displayedSentences.map((sentenceIndex) => {
          const sentence = sentences[sentenceIndex];
          // Split the sentence into words, preserving spaces and punctuation
          const words = sentence.match(/\S+|\s+/g) || [];
          
          return (
            <span key={sentenceIndex}>
              {words.map((word, wordIndex) => {
                // If it's a space, render it directly
                if (/^\s+$/.test(word)) {
                  return <React.Fragment key={`${sentenceIndex}-${wordIndex}`}>{word}</React.Fragment>;
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
          );
        })}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Sentence {currentSentenceIndex + 1} of {sentences.length}
        </span>
        <div className="flex gap-2">
          {currentSentenceIndex < sentences.length - 1 && (
            <>
              <Button 
                variant="outline"
                onClick={handleShowMore} 
                className="flex items-center gap-1"
              >
                <ChevronDown className="h-4 w-4" /> Show More
              </Button>
              <Button 
                onClick={handleReadNext} 
                className="bg-spanish-red hover:bg-spanish-red/90"
              >
                Read Next <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingPassage;
