import ru from './ru';
import en from './en';

export const RU = 'ru';
export const EN = 'en';

export enum Language {
  EN = 'en',
  RU = 'ru',
};

export function getTranslations(language: Language) {
  const locales = { ru, en };
  return locales[language] || {};
}
