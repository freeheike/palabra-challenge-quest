
import { SupportedLanguage } from './language';
import { ReadingPassage } from '@/data/readings';

export interface CollectedWord {
  word: string;
  translation: string;
}

export interface GameState {
  currentPassage: ReadingPassage | null;
  collectedWords: CollectedWord[];
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  isGameComplete: boolean;
  isInChallengeMode: boolean;
  remainingHearts: number;
  currentWordIndex: number;
  currentLanguage: SupportedLanguage;
  highlightedSentenceIndex: number | null;
}

export interface GameContextType extends GameState {
  startGame: (passageId?: string) => void;
  collectWord: (word: string) => string | null;
  selectAnswer: (answerIndex: number) => void;
  nextPassage: () => void;
  resetGame: () => void;
  startChallengeMode: () => void;
  checkVocabularyAnswer: (answer: string) => boolean;
  loseHeart: () => void;
  nextWord: () => void;
  changeLanguage: (language: SupportedLanguage) => void;
  highlightSentenceWithWord: (word: string) => void;
  getWordTranslation: (word: string) => string | null;
  preloadTranslations: (translations: Record<string, string>) => void;
}
