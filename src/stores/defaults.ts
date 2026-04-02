export const defaultUser: ProxyUser = {
  id: 0,
  language: 'ru',
};

export const defaultProxyItem: ProxyItem = {
  title: '',
  version: '',
  countries: [],
};

export const defaultProxyCountry: ProxyCountry = {
  name_ru: '',
  name_en: '',
  org_id: '',
  image: '',
};

export const defaultSettingsItem: SettingItemInstance = {
  label: '',
  value: '',
  menu: 'count_menu',
};

export const defaultSystemUser: SystemUser = {
  id: 0,
  bot_id: 0,
  user: {
    id: 0,
    telegram_id: 0,
    username: '',
    first_name: '',
    last_name: '',
    link: '',
    type: '',
  },
  ref: null,
  money: 0,
  status: 0,
  create_at: 0,
  update_at: 0,
  secret_user_key: '',
};

export const russiaCountry: ProxyCountry = {
  org_id: 'ru',
  name_ru: 'Россия',
  name_en: 'Russia',
  image:
    '//upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/22px-Flag_of_Russia.svg.png',
};

export const defaultProxyOrder: ProxyOrder = {
  order_org_id: '',
  proxy: '',
  country: defaultProxyCountry,
  status_org: '0',
  price: 0,
  host: '',
  port: '',
  user: '',
  pass: '',
  type: '',
  ip: '',
  start_time: 0,
  end_time: 0,
};

export class DefaultFilter {
  active: boolean;
  date: { from: number; to: number } | null;
  ended: boolean;
  ip: string;
  proxy: string;

  constructor() {
    this.active = false;
    this.ended = false;
    this.ip = '';
    this.proxy = '';
    this.date = null;
  }
}
