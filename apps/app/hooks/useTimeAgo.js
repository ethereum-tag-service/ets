import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import en from 'react-timeago/lib/language-strings/en';
import es from 'react-timeago/lib/language-strings/es';

const languageToFormatter = {
  'en': en,
  'es': es,
};

export default function useTimeAgo(language) {
  return buildFormatter(languageToFormatter[language]);
}
