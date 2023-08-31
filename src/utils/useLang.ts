import ruScheme from './lang/ru';
import enScheme from './lang/en';

import { useDataStore } from 'stores/data/dataStore';

export function useLang() {
  const data = useDataStore();

  return data.user.language === 'ru' ? ruScheme : enScheme;
}
