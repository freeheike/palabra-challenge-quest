
import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import ReadingPassage from '@/components/ReadingPassage';
import ComprehensionQuestion from '@/components/ComprehensionQuestion';
import LookupCounter from '@/components/LookupCounter';
import GameHeader from '@/components/GameHeader';
import GameInstructions from '@/components/GameInstructions';
import VocabularyChallenge from '@/components/VocabularyChallenge';

const GameContent: React.FC = () => {
  const { startGame, currentPassage, isInChallengeMode } = useGame();
  
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-end mb-4">
        {!isInChallengeMode && <GameInstructions />}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <ReadingPassage />
        </div>
        
        {!isInChallengeMode ? (
          <div className="w-full md:w-1/3">
            <LookupCounter />
          </div>
        ) : (
          <div className="w-full md:w-1/3">
            <VocabularyChallenge />
            <ComprehensionQuestion />
          </div>
        )}
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <GameProvider>
          <GameHeader />
          <GameContent />
        </GameProvider>
      </div>
    </div>
  );
};

export default Index;
