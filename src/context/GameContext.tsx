
import React, { createContext, useContext, useState } from 'react';
import { ReadingPassage, spanishReadings } from '@/data/spanishReadings';
import { useToast } from '@/components/ui/use-toast';

interface GameContextType {
  currentPassage: ReadingPassage | null;
  remainingLookups: number;
  usedLookups: string[];
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  isGameComplete: boolean;
  startGame: (passageId?: string) => void;
  lookupWord: (word: string) => string | null;
  selectAnswer: (answerIndex: number) => void;
  nextPassage: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const MAX_LOOKUPS = 10;

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null);
  const [remainingLookups, setRemainingLookups] = useState(MAX_LOOKUPS);
  const [usedLookups, setUsedLookups] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const { toast } = useToast();

  const startGame = (passageId?: string) => {
    let passage: ReadingPassage;
    
    if (passageId) {
      const found = spanishReadings.find(p => p.id === passageId);
      if (found) {
        passage = found;
      } else {
        passage = spanishReadings[0];
      }
    } else {
      // Select a random passage
      const randomIndex = Math.floor(Math.random() * spanishReadings.length);
      passage = spanishReadings[randomIndex];
    }
    
    setCurrentPassage(passage);
    setRemainingLookups(MAX_LOOKUPS);
    setUsedLookups([]);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setIsGameComplete(false);
  };

  const lookupWord = (word: string): string | null => {
    if (!currentPassage) return null;
    
    // Clean up the word (remove punctuation, make lowercase)
    const cleanWord = word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
    
    // Check if word is already looked up
    if (usedLookups.includes(cleanWord)) {
      return currentPassage.translations[cleanWord] || null;
    }
    
    // Check if we have lookups remaining
    if (remainingLookups <= 0) {
      toast({
        title: "No lookups remaining",
        description: "You've used all your word lookups!",
        variant: "destructive",
      });
      return null;
    }
    
    // Check if the word has a translation
    const translation = currentPassage.translations[cleanWord];
    if (!translation) {
      toast({
        title: "No translation available",
        description: "Sorry, we don't have a translation for this word.",
      });
      return null;
    }
    
    // Use a lookup
    setRemainingLookups(prev => prev - 1);
    setUsedLookups(prev => [...prev, cleanWord]);
    
    return translation;
  };

  const selectAnswer = (answerIndex: number) => {
    if (isGameComplete) return;
    
    setSelectedAnswer(answerIndex);
    
    if (currentPassage) {
      const correct = answerIndex === currentPassage.correctAnswer;
      setIsAnswerCorrect(correct);
      
      if (correct) {
        setIsGameComplete(true);
        toast({
          title: "¡Correcto!",
          description: "Great job! You answered correctly.",
          variant: "default",
        });
      } else {
        toast({
          title: "Incorrect",
          description: "Try again after reviewing the passage.",
          variant: "destructive",
        });
      }
    }
  };

  const nextPassage = () => {
    if (!isGameComplete) return;
    
    // Find next passage
    if (currentPassage) {
      const currentIndex = spanishReadings.findIndex(p => p.id === currentPassage.id);
      const nextIndex = (currentIndex + 1) % spanishReadings.length;
      const nextPassage = spanishReadings[nextIndex];
      
      startGame(nextPassage.id);
    }
  };

  const resetGame = () => {
    startGame();
  };

  return (
    <GameContext.Provider 
      value={{
        currentPassage,
        remainingLookups,
        usedLookups,
        selectedAnswer,
        isAnswerCorrect,
        isGameComplete,
        startGame,
        lookupWord,
        selectAnswer,
        nextPassage,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
