import React from 'react';
import ClickableWord from './ClickableWord';
import { useGame } from '@/context/GameContext';

const ReadingPassage: React.FC = () => {
  const { currentPassage } = useGame();
  
  if (!currentPassage) {
    return <div>Loading passage...</div>;
  }
  
  // Split the text into words, preserving spaces and punctuation
  const words = currentPassage.text.match(/\S+|\s+/g) || [];
  
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold text-spanish-text mb-4">{currentPassage.title}</h2>
      <div className="text-lg leading-relaxed bg-spanish-background p-6 rounded-lg shadow-md">
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
    </div>
  );
};

export default ReadingPassage;
