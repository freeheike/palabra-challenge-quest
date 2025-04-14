
export interface ReadingPassage {
  id: string;
  title: string;
  text: string;
  question: string;
  options: string[];
  correctAnswer: number;
  translations: Record<string, string>;
  sentenceTranslations?: Record<number, string>;
  romaji?: string; // Add romaji support for Japanese readings
}

export { spanishReadings } from './spanishReadings';
export { japaneseReadings } from './japaneseReadings';
