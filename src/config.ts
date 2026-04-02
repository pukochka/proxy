import { getQueryParam } from 'src/utils/string';

const config = {
  domain_bott: 'https://api.bot-t.com/v1/',
  domain_proxy: 'https://proxy6-back.bot-t.com',

  bot_id: getQueryParam('bot_id') || 0,
  public_key: getQueryParam('public_key') || '',

  dark: window.Telegram.WebApp.colorScheme === 'dark',
};

export default config;
