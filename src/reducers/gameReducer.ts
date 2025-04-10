
import { GameState } from '@/types/game';
import { ReadingPassage } from '@/data/spanishReadings';
import { MAX_HEARTS } from '@/constants/game';

type GameAction =
  | { type: 'SET_CURRENT_PASSAGE'; payload: ReadingPassage }
  | { type: 'COLLECT_WORD'; payload: { word: string; translation: string } }
  | { type: 'SELECT_ANSWER'; payload: number }
  | { type: 'SET_ANSWER_CORRECT'; payload: boolean }
  | { type: 'SET_GAME_COMPLETE'; payload: boolean }
  | { type: 'SET_CHALLENGE_MODE'; payload: boolean }
  | { type: 'DECREASE_HEARTS' }
  | { type: 'SET_CURRENT_WORD_INDEX'; payload: number }
  | { type: 'RESET_GAME' };

export const initialGameState: GameState = {
  currentPassage: null,
  collectedWords: [],
  selectedAnswer: null,
  isAnswerCorrect: null,
  isGameComplete: false,
  isInChallengeMode: false,
  remainingHearts: MAX_HEARTS,
  currentWordIndex: 0
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_CURRENT_PASSAGE':
      return {
        ...initialGameState,
        currentPassage: action.payload
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
        remainingHearts: MAX_HEARTS
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
    case 'RESET_GAME':
      return initialGameState;
    default:
      return state;
  }
};
