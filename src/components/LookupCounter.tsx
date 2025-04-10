
import React from 'react';
import { useGame, MAX_LOOKUPS } from '@/context/GameContext';
import { Progress } from '@/components/ui/progress';
import { Book } from 'lucide-react';

const LookupCounter: React.FC = () => {
  const { remainingLookups } = useGame();
  const percentage = (remainingLookups / MAX_LOOKUPS) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-spanish-red" />
          <span className="font-medium">Word Lookups Remaining</span>
        </div>
        <span className="text-spanish-text font-semibold">{remainingLookups}/{MAX_LOOKUPS}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default LookupCounter;
