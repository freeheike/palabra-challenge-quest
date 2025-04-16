import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ReadingPassage, spanishReadings, japaneseReadings, englishReadings } from '@/data/readings';
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
  const getReadings = useCallback(() => {
    console.log('getReadings - Current language:', state.currentLanguage);
    let readings;
    switch (state.currentLanguage) {
      case 'japanese':
        readings = japaneseReadings;
        break;
      case 'english':
        readings = englishReadings;
        break;
      case 'spanish':
      default:
        readings = spanishReadings;
        break;
    }
    console.log('getReadings - Selected readings:', readings);
    return readings;
  }, [state.currentLanguage]);

  const startGame = useCallback((passageId?: string) => {
    try {
      const readings = getReadings();
      console.log('startGame - Current language:', state.currentLanguage);
      console.log('startGame - Available readings:', readings);
      
      if (!readings || readings.length === 0) {
        console.error('No readings available for the current language:', state.currentLanguage);
        return;
      }

      let passage: ReadingPassage;
      
      if (passageId) {
        const found = readings.find(p => p.id === passageId);
        if (!found) {
          console.warn(`Passage with ID ${passageId} not found, using first passage`);
          passage = readings[0];
        } else {
          passage = found;
        }
      } else {
        const randomIndex = Math.floor(Math.random() * readings.length);
        passage = readings[randomIndex];
      }
      
      if (!passage) {
        console.error('No valid passage found');
        return;
      }
      
      console.log('startGame - Selected passage:', passage);
      dispatch({ type: 'SET_CURRENT_PASSAGE', payload: passage });
      dispatch({ type: 'RESET_GAME' });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }, [getReadings, state.currentLanguage, dispatch]);

  const changeLanguage = (language: SupportedLanguage) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    // Reset the game state when changing language
    dispatch({ type: 'RESET_GAME' });
    // Don't automatically start a new game
    // startGame();
  };

  const collectWord = (word: string): string | null => {
    if (!state.currentPassage) return null;
    
    const cleanWord = word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
    
    const existingWord = state.collectedWords.find(item => item.word === cleanWord);
    if (existingWord) {
      // Find translation ignoring case
      const translationKey = Object.keys(state.currentPassage.translations).find(
        key => key.toLowerCase() === cleanWord
      );
      return translationKey ? state.currentPassage.translations[translationKey] : null;
    }
    
    if (state.collectedWords.length >= WORDS_TO_COLLECT) {
      notifications.notifyEnoughWords();
      // Find translation ignoring case
      const translationKey = Object.keys(state.currentPassage.translations).find(
        key => key.toLowerCase() === cleanWord
      );
      return translationKey ? state.currentPassage.translations[translationKey] : null;
    }
    
    // Find translation ignoring case
    const translationKey = Object.keys(state.currentPassage.translations).find(
      key => key.toLowerCase() === cleanWord
    );
    const translation = translationKey ? state.currentPassage.translations[translationKey] : null;
    
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

  const highlightSentenceWithWord = (word: string) => {
    if (!state.currentPassage) return;
    
    const sentences = state.currentPassage.text.split(/(?<=[.!?])\s+/);
    const lowerCaseWord = word.toLowerCase();
    
    // Find the first sentence that contains the word
    const sentenceIndex = sentences.findIndex(sentence => {
      // Remove punctuation and make lowercase for comparison
      const cleanedSentence = sentence.toLowerCase().replace(/[.,;:!?'"()]/g, ' ');
      // Check for the whole word, not partial matches
      const words = cleanedSentence.split(/\s+/);
      return words.some(w => w === lowerCaseWord);
    });
    
    if (sentenceIndex !== -1) {
      dispatch({ type: 'SET_HIGHLIGHTED_SENTENCE', payload: sentenceIndex });
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
    dispatch({ type: 'SET_HIGHLIGHTED_SENTENCE', payload: null });
    
    if (newIndex >= state.collectedWords.length) {
      notifications.notifyChallengeComplete();
    }
  };

  const useTranslationItem = () => {
    if (state.translationItemCount > 0) {
      dispatch({ type: 'USE_TRANSLATION_ITEM' });
      return true;
    }
    return false;
  };

  // Initialize game when component mounts
  React.useEffect(() => {
    if (!state.currentPassage) {
      startGame();
    }
  }, [state.currentPassage, startGame]);

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
        changeLanguage,
        highlightSentenceWithWord,
        useTranslationItem
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
