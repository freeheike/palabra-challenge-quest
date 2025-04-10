import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGame } from '@/context/GameContext';

interface ClickableWordProps {
  word: string;
  originalWord: string;
}

const ClickableWord: React.FC<ClickableWordProps> = ({ word, originalWord }) => {
  const { lookupWord, usedLookups } = useGame();
  const [translation, setTranslation] = useState<string | null>(null);
  
  // Clean the word for lookup (remove punctuation)
  const cleanWord = word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
  
  // Check if this word has already been looked up
  const isLookedUp = usedLookups.includes(cleanWord);
  
  const handleClick = () => {
    if (!isLookedUp) {
      const result = lookupWord(word);
      if (result) {
        setTranslation(result);
      }
    }
  };
  
  // If the word has already been looked up, show tooltip
  if (isLookedUp && translation) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span 
              className="cursor-help underline decoration-dotted underline-offset-4 text-spanish-red"
              onClick={handleClick}
            >
              {originalWord}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{translation}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Otherwise, show clickable word
  return (
    <span 
      className={`cursor-pointer hover:text-spanish-gold transition-colors duration-150 ${isLookedUp ? 'text-spanish-red' : ''}`} 
      onClick={handleClick}
    >
      {originalWord}
    </span>
  );
};

export default ClickableWord;
