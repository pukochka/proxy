import { boot } from 'quasar/wrappers';
import { fetchProxy, fetchUser } from 'boot/queries';

import config from 'src/config';
import { Dark } from 'quasar';

export default boot(async () => {
  Dark.set(config.dark);

  window.Telegram.WebApp.enableClosingConfirmation();

  fetchProxy('getSettings', { public_key: config.public_key });

  fetchUser();
});
