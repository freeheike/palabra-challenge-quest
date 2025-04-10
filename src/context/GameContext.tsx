
import React, { createContext, useContext, useState } from 'react';
import { ReadingPassage, spanishReadings } from '@/data/spanishReadings';
import { useToast } from '@/components/ui/use-toast';

interface GameContextType {
  currentPassage: ReadingPassage | null;
  collectedWords: Array<{word: string, translation: string}>;
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  isGameComplete: boolean;
  isInChallengeMode: boolean;
  remainingHearts: number;
  currentWordIndex: number;
  startGame: (passageId?: string) => void;
  collectWord: (word: string) => string | null;
  selectAnswer: (answerIndex: number) => void;
  nextPassage: () => void;
  resetGame: () => void;
  startChallengeMode: () => void;
  checkVocabularyAnswer: (answer: string) => boolean;
  loseHeart: () => void;
  nextWord: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const WORDS_TO_COLLECT = 10;
export const MAX_HEARTS = 5;

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null);
  const [collectedWords, setCollectedWords] = useState<Array<{word: string, translation: string}>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isInChallengeMode, setIsInChallengeMode] = useState(false);
  const [remainingHearts, setRemainingHearts] = useState(MAX_HEARTS);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
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
    setCollectedWords([]);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setIsGameComplete(false);
    setIsInChallengeMode(false);
    setRemainingHearts(MAX_HEARTS);
    setCurrentWordIndex(0);
  };

  const collectWord = (word: string): string | null => {
    if (!currentPassage) return null;
    
    // Clean up the word (remove punctuation, make lowercase)
    const cleanWord = word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
    
    // Check if word is already collected
    if (collectedWords.some(item => item.word === cleanWord)) {
      return currentPassage.translations[cleanWord] || null;
    }
    
    // Check if we already have the maximum number of words
    if (collectedWords.length >= WORDS_TO_COLLECT) {
      toast({
        title: "¡Excelente!",
        description: "You've collected enough words! Start the challenge now.",
      });
      return currentPassage.translations[cleanWord] || null;
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
    
    // Collect the word
    setCollectedWords(prev => [...prev, {word: cleanWord, translation}]);
    
    toast({
      title: `¡Palabra coleccionada! (${collectedWords.length + 1}/${WORDS_TO_COLLECT})`,
      description: `${cleanWord}: ${translation}`,
      variant: "default",
    });
    
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
        loseHeart();
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
  
  const startChallengeMode = () => {
    if (collectedWords.length >= WORDS_TO_COLLECT) {
      setIsInChallengeMode(true);
      setCurrentWordIndex(0);
      setRemainingHearts(MAX_HEARTS);
    } else {
      toast({
        title: "Not enough words collected",
        description: `You need to collect ${WORDS_TO_COLLECT} words first. Current: ${collectedWords.length}`,
        variant: "destructive",
      });
    }
  };
  
  const checkVocabularyAnswer = (answer: string): boolean => {
    if (currentWordIndex < collectedWords.length) {
      const isCorrect = answer.toLowerCase().trim() === collectedWords[currentWordIndex].translation.toLowerCase().trim();
      if (!isCorrect) {
        loseHeart();
      }
      return isCorrect;
    }
    return false;
  };
  
  const loseHeart = () => {
    setRemainingHearts(prev => {
      const newValue = prev - 1;
      if (newValue <= 0) {
        toast({
          title: "Challenge Failed",
          description: "You've lost all your hearts. Try again!",
          variant: "destructive",
        });
      }
      return newValue;
    });
  };
  
  const nextWord = () => {
    setCurrentWordIndex(prev => {
      const newIndex = prev + 1;
      if (newIndex >= collectedWords.length) {
        // If we've gone through all words, go to reading comprehension test
        toast({
          title: "Vocabulary Challenge Complete!",
          description: "Now try the reading comprehension question.",
          variant: "default",
        });
      }
      return newIndex;
    });
  };

  return (
    <GameContext.Provider 
      value={{
        currentPassage,
        collectedWords,
        selectedAnswer,
        isAnswerCorrect,
        isGameComplete,
        isInChallengeMode,
        remainingHearts,
        currentWordIndex,
        startGame,
        collectWord,
        selectAnswer,
        nextPassage,
        resetGame,
        startChallengeMode,
        checkVocabularyAnswer,
        loseHeart,
        nextWord
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
