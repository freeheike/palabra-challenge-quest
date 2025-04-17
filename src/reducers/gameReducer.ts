import { GameState } from '@/types/game';
import { ReadingPassage } from '@/data/readings';
import { MAX_HEARTS } from '@/constants/game';
import { SupportedLanguage } from '@/types/language';

export type GameAction =
  | { type: 'SET_CURRENT_PASSAGE'; payload: ReadingPassage }
  | { type: 'COLLECT_WORD'; payload: { word: string; translation: string } }
  | { type: 'SELECT_ANSWER'; payload: number }
  | { type: 'SET_ANSWER_CORRECT'; payload: boolean }
  | { type: 'SET_GAME_COMPLETE'; payload: boolean }
  | { type: 'SET_CHALLENGE_MODE'; payload: boolean }
  | { type: 'DECREASE_HEARTS' }
  | { type: 'SET_CURRENT_WORD_INDEX'; payload: number }
  | { type: 'SET_LANGUAGE'; payload: SupportedLanguage }
  | { type: 'SET_HIGHLIGHTED_SENTENCE'; payload: number | null }
  | { type: 'RESET_GAME' }
  | { type: 'USE_TRANSLATION_ITEM' };

export const initialGameState: GameState = {
  currentPassage: null,
  collectedWords: [],
  selectedAnswer: null,
  isAnswerCorrect: null,
  isGameComplete: false,
  isInChallengeMode: false,
  remainingHearts: MAX_HEARTS,
  currentWordIndex: 0,
  currentLanguage: 'spanish',
  highlightedSentenceIndex: null,
  translationItemCount: 5
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_CURRENT_PASSAGE':
      return {
        ...state,
        currentPassage: action.payload,
        collectedWords: [],
        selectedAnswer: null,
        isAnswerCorrect: null,
        isGameComplete: false,
        isInChallengeMode: false,
        remainingHearts: MAX_HEARTS,
        currentWordIndex: 0,
        highlightedSentenceIndex: null
      };
    case 'COLLECT_WORD':
      return {
        ...state,
        collectedWords: [...state.collectedWords, action.payload]
      };
    case 'SELECT_ANSWER':
      return {
        ...state,
        selectedAnswer: action.payload
      };
    case 'SET_ANSWER_CORRECT':
      return {
        ...state,
        isAnswerCorrect: action.payload
      };
    case 'SET_GAME_COMPLETE':
      return {
        ...state,
        isGameComplete: action.payload
      };
    case 'SET_CHALLENGE_MODE':
      return {
        ...state,
        isInChallengeMode: action.payload,
        currentWordIndex: 0,
        remainingHearts: MAX_HEARTS,
        highlightedSentenceIndex: null
      };
    case 'DECREASE_HEARTS':
      return {
        ...state,
        remainingHearts: Math.max(0, state.remainingHearts - 1)
      };
    case 'SET_CURRENT_WORD_INDEX':
      return {
        ...state,
        currentWordIndex: action.payload
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload,
        currentPassage: null,
        collectedWords: [],
        selectedAnswer: null,
        isAnswerCorrect: null,
        isGameComplete: false,
        isInChallengeMode: false,
        remainingHearts: MAX_HEARTS,
        currentWordIndex: 0,
        highlightedSentenceIndex: null
      };
    case 'SET_HIGHLIGHTED_SENTENCE':
      return {
        ...state,
        highlightedSentenceIndex: action.payload
      };
    case 'RESET_GAME':
      return {
        ...state,
        collectedWords: [],
        selectedAnswer: null,
        isAnswerCorrect: null,
        isGameComplete: false,
        isInChallengeMode: false,
        remainingHearts: MAX_HEARTS,
        currentWordIndex: 0,
        highlightedSentenceIndex: null
      };
    case 'USE_TRANSLATION_ITEM':
      if (state.translationItemCount > 0) {
        return {
          ...state,
          translationItemCount: state.translationItemCount - 1
        };
      }
      return state;
    default:
      return state;
  }
};
