import config from 'src/config';
import { boot } from 'quasar/wrappers';
import { fetchProxy, fetchUser } from 'boot/queries';

import { Dark, LocalStorage, setCssVar } from 'quasar';

export default boot(async () => {
  Dark.set(config.dark);

  const primary = <string>LocalStorage.getItem('_bott-primary');

  if (primary) {
    setCssVar('primary', primary);
  }

  window.Telegram.WebApp.enableClosingConfirmation();
  window.Telegram.WebApp.expand();

  fetchProxy('getSettings', { public_key: config.public_key });

  fetchUser();
});
