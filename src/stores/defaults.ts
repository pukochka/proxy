const defaultUser: ProxyUser = {
  id: 0,
  language: 'ru',
};

const defaultProxyItem: ProxyItem = {
  title: '',
  version: '',
  countries: [],
};

const defaultProxyCountry: ProxyCountry = {
  name_ru: '',
  name_en: '',
  org_id: '',
  image: '',
};

const defaultSettingsItem: SettingItemInstance = {
  label: '',
  value: '',
  menu: 'count_menu',
};

const defaultSystemUser: SystemUser = {
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

const russiaCountry: ProxyCountry = {
  org_id: 'ru',
  name_ru: 'Россия',
  name_en: 'Russia',
  image:
    '//upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/22px-Flag_of_Russia.svg.png',
};

const defaultProxyOrder: ProxyOrder = {
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
  start_time: 1683544062,
  end_time: 1683803262,
};

class DefaultFilter {
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

export {
  defaultUser,
  defaultSystemUser,
  defaultSettingsItem,
  defaultProxyItem,
  defaultProxyCountry,
  russiaCountry,
  defaultProxyOrder,
  DefaultFilter,
};
