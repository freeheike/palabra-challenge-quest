export type SupportedLanguage = 'spanish' | 'japanese' | 'english';

export interface LanguageOption {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const languageOptions: LanguageOption[] = [
  { id: 'spanish', name: 'Spanish', nativeName: 'Español' },
  { id: 'japanese', name: 'Japanese', nativeName: '日本語' },
  { id: 'english', name: 'English', nativeName: 'English' }
];
