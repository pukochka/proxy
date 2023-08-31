/**
 * Types for Proxy-service bot-t.com
 * (c) 2023-present
 * */

declare enum ProxyQueriesEnum {
  /**
   * Возвращает массив прокси
   * */
  getProxy = 'getProxy',

  /**
   * Возвращает пользователя
   * */
  getUser = 'getUser',

  /**
   * Возвращает настройку модуля
   * */
  getSettings = 'getSettings',

  /**
   * Используется для получения информации о доступных для приобретения странах
   *
   * Возвращает массив стран
   * */
  getCountry = 'getCountry',

  /**
   * Используется для получения информации о доступном для приобретения кол-ве прокси определенной страны.
   *
   * Возвращает количество
   * */
  getCount = 'getCount',

  /**
   * Используется для получения информации о доступном для приобретения кол-ве прокси определенной страны.
   *
   * Возвращает массив с ценой и доступным количестве
   * */
  getPrice = 'getPrice',

  /**
   * Используется для покупки прокси
   *
   * Возвращает массив с созданным заказом
   * */
  buyProxy = 'buyProxy',

  /**
   * Используется для изменения типа (протокола) у списка прокси
   *
   * В случае успеха вернет true, неудачи – error message
   * */
  updateType = 'updateType',

  /**
   * Используется для продления прокси
   *
   * Возвращает массив с созданным заказом
   * */
  prolongProxy = 'prolongProxy',

  /**
   * Используется для удаления прокси.
   * При удалении прокси сделать запрос на getOrders()
   *
   * В случае успеха вернет true, неудачи – error message
   * */
  deleteProxy = 'deleteProxy',

  /**
   * Используется для проверки валидности (работоспособности) прокси.
   *
   * Возвращает статус статус работоспособности
   * */
  checkWork = 'checkWork',

  /**
   * Используется получения заказов
   *
   * Возвращает массив с заказами пользователя
   * */
  getOrders = 'getOrders',

  /**
   * Задать язык
   *
   * */
  setLanguage = 'setLanguage',
}

declare interface PublicKey {
  /**
   * Публичный ключ модуля (GET string)
   * */
  public_key: string;
}

declare interface BottParams extends PublicKey {
  /**
   * Приватный ключ пользователя(GET string)
   * */
  user_secret_key: string;
}

/**
 * Запрос /getProxy
 * */
declare interface ProxyGetProxyParams {
  /**
   * Публичный ключ модуля (GET string)
   * */
  public_key: string;
}

/**
 * Запрос /getUser
 * */
declare interface ProxyGetUserParams {
  /**
   * Уникальный идентификатор пользователя (GET number)
   * */
  user_id: number;
}

/**
 * Запрос /getCountry
 * */
declare interface ProxyGetCountryParams {
  /**
   * Для какого прокси получить страны
   * */
  version: string;
}

/**
 * Запрос /getCount
 * */
declare interface ProxyGetCountParams extends BottParams {
  /**
   * Для какой страны
   * */
  country: string;
  /**
   * Для какого прокси получить страны
   * */
  version: string;
}

/**
 * Запрос /getPrice
 * */
declare interface ProxyGetPriceParams extends PublicKey {
  /**
   * Количество дней
   * */
  period: string;
  /**
   * Количество прокси
   * */
  count: string;
  /**
   * Для какого прокси получить
   * */
  version: string;
}

/**
 * Запрос /buyProxy
 * */
declare interface ProxyBuyProxyParams
  extends ProxyGetPriceParams,
    BottParams,
    ProxyGetUserParams {
  /**
   * http | socks
   * */
  type: string;
  /**
   * Количество прокси
   * */
  country: string;
}

/**
 * Запрос /getOrders
 * */
declare interface ProxyGetOrdersParams extends BottParams {
  /**
   * Уникальный идентификатор пользователя
   * */
  user_id: number;
}

/**
 * Запрос /checkWork
 * */
declare interface ProxyCheckWorkParams extends ProxyGetOrdersParams {
  /**
   * id заказа
   * */
  order_org_id: string;
}

/**
 * Запрос /updateType
 * */
declare interface ProxyUpdateTypeParams extends ProxyCheckWorkParams {
  /**
   * http | socks
   * */
  type: string;
}

/**
 * Запрос /prolongProxy
 * */
declare interface ProxyProlongProxyParams extends BottParams {
  /**
   * id заказа
   * */
  order_org_id: string;
  /**
   * Уникальный идентификатор пользователя
   * */
  user_id: number;
  /**
   * Количество дней
   * */
  period: string;
  /**
   * цена продления
   * */
  enter_amount: number;
}

/**
 * Запрос /setLanguage
 * */
declare interface ProxySetLangParams {
  /**
   * Уникальный идентификатор пользователя (GET number)
   * */
  user_id: number;
  /**
   * Язык ( eng или ru )
   * */
  language: string;
  /**
   * Приватный ключ пользователя(GET string)
   * */
  user_secret_key: string;
}

declare type ProxyQueries = keyof typeof ProxyQueriesEnum;

/**
 * GET параметры для запросов
 * */
declare type ProxyParams<Q = ProxyQueries> = Q extends 'getProxy'
  ? ProxyGetProxyParams
  : Q extends 'getUser'
  ? ProxyGetUserParams
  : Q extends 'getCountry'
  ? ProxyGetCountryParams
  : Q extends 'getCount'
  ? ProxyGetCountParams
  : Q extends 'getPrice'
  ? ProxyGetPriceParams
  : Q extends 'setLanguage'
  ? ProxySetLangParams
  : Q extends 'buyProxy'
  ? ProxyBuyProxyParams
  : Q extends 'getOrders'
  ? ProxyGetOrdersParams
  : Q extends 'checkWork'
  ? ProxyCheckWorkParams
  : Q extends 'updateType'
  ? ProxyUpdateTypeParams
  : Q extends 'deleteProxy'
  ? ProxyCheckWorkParams
  : Q extends 'prolongProxy'
  ? ProxyProlongProxyParams
  : Q extends 'getSettings'
  ? PublicKey
  : null;

/**
 * Статусы
 *
 * 0 - Удалено
 *
 * 1 - Активен
 *
 * 2 - Окончен
 *
 * */
