
import React, { useState } from 'react';
import ClickableWord from './ClickableWord';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ReadingPassage: React.FC = () => {
  const { currentPassage } = useGame();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  
  if (!currentPassage) {
    return <div>Loading passage...</div>;
  }
  
  // Split the text into sentences
  const sentences = currentPassage.text.split(/(?<=[.!?])\s+/);
  
  // Get the current sentence to display
  const currentSentence = sentences[currentSentenceIndex];
  
  // Split the sentence into words, preserving spaces and punctuation
  const words = currentSentence.match(/\S+|\s+/g) || [];
  
  const handleReadNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prevIndex => prevIndex + 1);
    }
  };
  
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold text-spanish-text mb-4">{currentPassage.title}</h2>
      
      <div className="text-lg leading-relaxed bg-spanish-background p-6 rounded-lg shadow-md min-h-[200px]">
        {words.map((word, index) => {
          // If it's a space, render it directly
          if (/^\s+$/.test(word)) {
            return <React.Fragment key={index}>{word}</React.Fragment>;
          }
          
          // Otherwise, it's a word to be made clickable
          return (
            <ClickableWord 
              key={index}
              word={word.toLowerCase().replace(/[.,;:!?'"()]/g, '')}
              originalWord={word}
            />
          );
        })}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Sentence {currentSentenceIndex + 1} of {sentences.length}
        </span>
        {currentSentenceIndex < sentences.length - 1 && (
          <Button onClick={handleReadNext} className="bg-spanish-red hover:bg-spanish-red/90">
            Read Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReadingPassage;
