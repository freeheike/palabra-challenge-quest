
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, RefreshCcw } from 'lucide-react';
import { WORDS_TO_COLLECT } from '@/constants/game';
import LanguageSelector from './LanguageSelector';

const GameHeader: React.FC = () => {
  const { 
    collectedWords, 
    isInChallengeMode, 
    startChallengeMode, 
    resetGame 
  } = useGame();
  
  const hasEnoughWords = collectedWords.length >= WORDS_TO_COLLECT;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-spanish-red">Language Learning Assistant</h1>
        <p className="text-gray-600">
          {isInChallengeMode 
            ? 'Test your knowledge!' 
            : `Collect ${WORDS_TO_COLLECT} words to unlock the challenge.`}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <LanguageSelector />
        
        {!isInChallengeMode && (
          <Button
            onClick={startChallengeMode}
            disabled={!hasEnoughWords}
            className="bg-spanish-red hover:bg-spanish-red/90"
          >
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Start Challenge
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={resetGame}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          New Reading
        </Button>
      </div>
    </div>
  );
};

export default GameHeader;
