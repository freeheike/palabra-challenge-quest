
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame, MAX_HEARTS } from '@/context/GameContext';
import { RefreshCw, Heart } from 'lucide-react';

const GameHeader: React.FC = () => {
  const { resetGame, isInChallengeMode, remainingHearts } = useGame();
  
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-spanish-text">
            <span className="text-spanish-red">Palabra</span> Challenge
          </h1>
          <p className="text-muted-foreground">
            Read, understand, and answer questions in Spanish!
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isInChallengeMode && (
            <div className="flex">
              {[...Array(MAX_HEARTS)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`h-5 w-5 ${i < remainingHearts ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          )}
          <Button
            variant="outline"
            onClick={resetGame}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            New Challenge
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
