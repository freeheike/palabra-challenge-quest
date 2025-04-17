
import React from 'react';
import { useGame } from '@/context/GameContext';
import { WORDS_TO_COLLECT } from '@/constants/game';
import { Progress } from '@/components/ui/progress';
import { Book, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LookupCounter: React.FC = () => {
  const { collectedWords, startChallengeMode } = useGame();
  const percentage = (collectedWords.length / WORDS_TO_COLLECT) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-spanish-red" />
          <span className="font-medium">Words Collected</span>
        </div>
        <span className="text-spanish-text font-semibold">{collectedWords.length}/{WORDS_TO_COLLECT}</span>
      </div>
      <Progress value={percentage} className="h-2 mb-3" />
      
      {collectedWords.length >= WORDS_TO_COLLECT && (
        <Button 
          onClick={startChallengeMode}
          className="w-full bg-spanish-gold hover:bg-amber-600 text-white"
        >
          <Check className="mr-2 h-4 w-4" /> Start Challenge
        </Button>
      )}
      
      <div className="mt-4 border rounded-lg p-3 max-h-60 overflow-y-auto">
        <h3 className="font-medium mb-2">Collected Words:</h3>
        {collectedWords.length > 0 ? (
          <ul className="space-y-1">
            {collectedWords.map((item, index) => (
              <li key={index} className="text-sm flex justify-between">
                <span className="font-semibold">{item.word}</span>
                <span className="text-muted-foreground">{item.translation}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Click on words in the passage to collect them.
          </p>
        )}
      </div>
    </div>
  );
};

export default LookupCounter;
