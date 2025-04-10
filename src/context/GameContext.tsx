
import React, { createContext, useContext, useReducer } from 'react';
import { ReadingPassage, spanishReadings, japaneseReadings } from '@/data/readings';
import { GameContextType } from '@/types/game';
import { gameReducer, initialGameState } from '@/reducers/gameReducer';
import { useGameNotifications } from '@/hooks/useGameNotifications';
import { WORDS_TO_COLLECT } from '@/constants/game';
import { SupportedLanguage } from '@/types/language';

export { WORDS_TO_COLLECT } from '@/constants/game';
export { MAX_HEARTS } from '@/constants/game';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const notifications = useGameNotifications();

  // Get the appropriate readings based on the current language
  const getReadings = () => {
    switch (state.currentLanguage) {
      case 'japanese':
        return japaneseReadings;
      case 'spanish':
      default:
        return spanishReadings;
    }
  };

  const startGame = (passageId?: string) => {
    const readings = getReadings();
    let passage: ReadingPassage;
    
    if (passageId) {
      const found = readings.find(p => p.id === passageId);
      if (found) {
        passage = found;
      } else {
        passage = readings[0];
      }
    } else {
      const randomIndex = Math.floor(Math.random() * readings.length);
      passage = readings[randomIndex];
    }
    
    dispatch({ type: 'SET_CURRENT_PASSAGE', payload: passage });
  };

  const changeLanguage = (language: SupportedLanguage) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    setTimeout(() => {
      startGame();
    }, 0);
  };

  const collectWord = (word: string): string | null => {
    if (!state.currentPassage) return null;
    
    const cleanWord = word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
    
    const existingWord = state.collectedWords.find(item => item.word === cleanWord);
    if (existingWord) {
      return state.currentPassage.translations[cleanWord] || null;
    }
    
    if (state.collectedWords.length >= WORDS_TO_COLLECT) {
      notifications.notifyEnoughWords();
      return state.currentPassage.translations[cleanWord] || null;
    }
    
    const translation = state.currentPassage.translations[cleanWord];
    if (!translation) {
      notifications.notifyNoTranslation();
      return null;
    }
    
    dispatch({ 
      type: 'COLLECT_WORD', 
      payload: { word: cleanWord, translation } 
    });
    
    notifications.notifyWordCollected(
      cleanWord, 
      translation, 
      state.collectedWords.length + 1
    );
    
    return translation;
  };

  const selectAnswer = (answerIndex: number) => {
    if (state.isGameComplete) return;
    
    dispatch({ type: 'SELECT_ANSWER', payload: answerIndex });
    
    if (state.currentPassage) {
      const correct = answerIndex === state.currentPassage.correctAnswer;
      dispatch({ type: 'SET_ANSWER_CORRECT', payload: correct });
      
      if (correct) {
        dispatch({ type: 'SET_GAME_COMPLETE', payload: true });
        notifications.notifyCorrectAnswer();
      } else {
        loseHeart();
        notifications.notifyIncorrectAnswer();
      }
    }
  };

  const nextPassage = () => {
    if (!state.isGameComplete && state.remainingHearts > 0) return;
    
    if (state.currentPassage) {
      const readings = getReadings();
      const currentIndex = readings.findIndex(p => p.id === state.currentPassage!.id);
      const nextIndex = (currentIndex + 1) % readings.length;
      const nextPassage = readings[nextIndex];
      
      startGame(nextPassage.id);
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    startGame();
  };
  
  const startChallengeMode = () => {
    if (state.collectedWords.length >= WORDS_TO_COLLECT) {
      dispatch({ type: 'SET_CHALLENGE_MODE', payload: true });
    } else {
      notifications.notifyNotEnoughWords(state.collectedWords.length);
    }
  };
  
  const checkVocabularyAnswer = (answer: string): boolean => {
    if (state.currentWordIndex < state.collectedWords.length) {
      const isCorrect = answer === state.collectedWords[state.currentWordIndex].translation;
      if (!isCorrect) {
        loseHeart();
      }
      return isCorrect;
    }
    return false;
  };
  
  const loseHeart = () => {
    dispatch({ type: 'DECREASE_HEARTS' });
    
    if (state.remainingHearts <= 1) {
      notifications.notifyChallengeFailed();
    }
  };
  
  const nextWord = () => {
    const newIndex = state.currentWordIndex + 1;
    dispatch({ type: 'SET_CURRENT_WORD_INDEX', payload: newIndex });
    
    if (newIndex >= state.collectedWords.length) {
      notifications.notifyChallengeComplete();
    }
  };

  // Initialize game when component mounts
  React.useEffect(() => {
    if (!state.currentPassage) {
      startGame();
    }
  }, []);

  return (
    <GameContext.Provider 
      value={{
        ...state,
        startGame,
        collectWord,
        selectAnswer,
        nextPassage,
        resetGame,
        startChallengeMode,
        checkVocabularyAnswer,
        loseHeart,
        nextWord,
        changeLanguage
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
