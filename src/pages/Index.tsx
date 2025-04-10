
import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import ReadingPassage from '@/components/ReadingPassage';
import ComprehensionQuestion from '@/components/ComprehensionQuestion';
import LookupCounter from '@/components/LookupCounter';
import GameHeader from '@/components/GameHeader';
import GameInstructions from '@/components/GameInstructions';

const GameContent: React.FC = () => {
  const { startGame, currentPassage } = useGame();
  
  useEffect(() => {
    if (!currentPassage) {
      startGame();
    }
  }, [currentPassage, startGame]);
  
  if (!currentPassage) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Loading challenge...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <LookupCounter />
        <GameInstructions />
      </div>
      <ReadingPassage />
      <ComprehensionQuestion />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <GameProvider>
          <GameHeader />
          <GameContent />
        </GameProvider>
      </div>
    </div>
  );
};

export default Index;
