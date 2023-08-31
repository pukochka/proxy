/**
 * Types for Proxy-service bot-t.com
 * (c) 2023-present
 * */

/**
 * Сущность пользователя системы bott
 * */
declare interface SystemUser {
  id: number;
  bot_id: number;
  user: {
    id: number;
    telegram_id: number;
    username: string;
    first_name: string;
    last_name: string;
    link: string;
    type: string;
  };
  ref: null;
  money: number;
  status: number;
  create_at: number;
  update_at: number;
  secret_user_key: string;
}

/**
 * Сущность пользователя для приложения
 * */
declare interface ProxyUser {
  /**
   * идентификатор пользователя ( tg_id )
   * */
  id: number;
  /**
   * (ru или eng)
   * */
  language: 'ru' | 'eng';
}

/**
 * Сущность элемента прокси
 * */
declare interface ProxyItem {
  /**
   * идентификатор
   * */
  version: string;
  /**
   * (ru или eng)
   * */
  title: string;
  /**
   *
   * */
  countries: ProxyCountry[];
}

declare interface ProxyOrder {
  /**
   *
   * */
  order_org_id: string;
  /**
   *
   * */
  proxy: string;
  /**
   *
   * */
  country: ProxyCountry;
  /**
   *
   * */
  price: number;
  /**
   *
   * */
  host: string;
  /**
   *
   * */
  port: string;
  /**
   *
   * */
  user: string;
  /**
   *
   * */
  pass: string;
  /**
   *
   * */
  type: string;
  /**
   *
   * */
  ip: string;
  /**
   *
   * */
  status_org: '0' | '1' | '2';
  /**
   *
   * */
  start_time: number;
  /**
   *
   * */
  end_time: number;
}

declare interface ProxyCountry {
  /**
   *
   **/
  org_id: string;
  /**
   *
   **/
  name_ru: string;
  /**
   *
   **/
  name_en: string;
  /**
   *
   **/
  image: string;
}

declare interface SettingItemInstance {
  label: string;
  value: string;
  menu: 'count_menu' | 'country_menu' | 'date_menu' | '';
  icon?: string;
}
