
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { RefreshCw } from 'lucide-react';

const GameHeader: React.FC = () => {
  const { resetGame } = useGame();
  
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
        <Button
          variant="outline"
          onClick={resetGame}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          New Challenge
        </Button>
      </div>
    </header>
  );
};

export default GameHeader;
