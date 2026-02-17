import config from 'src/config';
import { boot } from 'quasar/wrappers';
import { fetchProxy, fetchUser } from 'boot/queries';

import { Dark, LocalStorage, setCssVar } from 'quasar';

export default boot(async () => {
  Dark.set(config.dark);

  const primary = <string>LocalStorage.getItem('_bott-primary');
  const secondary = <string>LocalStorage.getItem('_bott-secondary');

  if (primary && secondary) {
    setCssVar('primary', primary);
    setCssVar('secondary', secondary);
  }

  window.Telegram.WebApp.enableClosingConfirmation();
  window.Telegram.WebApp.expand();

  fetchProxy('getSettings', { public_key: config.public_key });

  fetchUser();
});
