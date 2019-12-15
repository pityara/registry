import React, { useState, useCallback, useMemo } from 'react';
import { Language, getTranslations } from '../locale/loc';

const LocalizationContext = React.createContext<{
  locales: Language[],
  onChangeLocale: (Language) => void,
  currentLocale: Language,
  onGetTranslation: (string) => string,
}>({
  locales: [Language.EN, Language.RU],
  onChangeLocale: (lang) => null,
  currentLocale: Language.RU,
  onGetTranslation: (key) => key,
});

export function LocalizationContextProvider(props) {
  const { children } = props;
  const [locale, setLocale] = useState(Language.RU);

  const translations = useMemo(() => getTranslations(locale), [locale]);

  const getTranslation = useCallback((key) => translations[key] || key, [translations]);

  return (
    <LocalizationContext.Provider
      value={{
        locales: [Language.EN, Language.RU],
        onChangeLocale: setLocale,
        currentLocale: locale,
        onGetTranslation: getTranslation,
      }}
    >
      {children}
    </LocalizationContext.Provider >
  )
}

export default LocalizationContext;
