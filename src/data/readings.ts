import { spanishReadings } from './spanishReadings';
import { japaneseReadings } from './japaneseReadings';
import { englishReadings } from './englishReadings';

export interface ReadingPassage {
  id: string;
  title: string;
  text: string;
  question: string;
  options: string[];
  correctAnswer: number;
  sentenceTranslations?: Record<string, string>;
  sentenceRomaji?: Record<string, string>;
  sentenceKana?: Record<string, string>;
}

export { spanishReadings, japaneseReadings, englishReadings };
