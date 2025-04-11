
export interface ReadingPassage {
  id: string;
  title: string;
  text: string;
  question: string;
  options: string[];
  correctAnswer: number;
  translations: Record<string, string>;
  sentenceTranslations?: Record<number, string>;
  sentenceRomaji?: Record<number, string>;
}

export { spanishReadings } from './spanishReadings';
export { japaneseReadings } from './japaneseReadings';
