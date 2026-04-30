import { defineStore } from 'pinia';

import config from 'src/config';

import {
  defaultProxyItem,
  defaultSystemUser,
  defaultUser,
  defaultProxyCountry,
  defaultProxyOrder,
  DefaultFilter,
} from 'stores/defaults';

import { Quasar } from 'quasar';

import langEn from 'quasar/lang/en-GB';
import langRu from 'quasar/lang/ru';

import { i18n, proxyLanguageToLocale } from 'src/i18n';

import { useDialog } from 'src/utils/useDialog';

import { fetchProxy } from 'boot/queries';

import { DataModel, OrderFilter, OrderFilterOf } from 'stores/data/models';

export const useDataStore = defineStore('data', {
  state: () =>
    ({
      proxiesValue: [],
      ordersValue: [],

      userValue: defaultUser,
      systemUserValue: defaultSystemUser,

      selected: defaultProxyItem,
      selectedOrder: defaultProxyOrder,

      selectedCountry: defaultProxyCountry,
      selectedCount: 1,
      selectedDate: 30,
      mtproto: 0,

      range: {
        max: 1,
        min: 1,
      },

      payment: {
        price: 0,
        period: 30,
        price_single: 0,
        count: 0,
      },

      multiply: false,
      filterOrders: new DefaultFilter(),
    } as DataModel),
  getters: {
    user: (state): ProxyUser => state.userValue,
    systemUser: (state): SystemUser => state.systemUserValue,

    proxies: (state): ProxyItem[] =>
      state.proxiesValue.filter(
        (item) => !!state.mtproto || item.version !== '5'
      ),
    orders: (state): ProxyOrder[] =>
      state.ordersValue
        .reverse()
        .filter((order) =>
          state.filterOrders.active ? order.status_org === '1' : order
        )
        .filter((order) =>
          state.filterOrders.ended ? order.status_org === '2' : order
        )
        .filter((order) =>
          state.filterOrders.proxy !== ''
            ? order.proxy === state.filterOrders.proxy
            : order
        )
        .filter((order) =>
          state.filterOrders.date !== null
            ? state.filterOrders.date.from > order.start_time &&
              state.filterOrders.date.to < order.end_time
            : order
        )
        .filter((order) =>
          state.filterOrders.ip !== ''
            ? order.ip === state.filterOrders.ip
            : order
        ),
    /*  */
    dateRange: (state) => {
      const scheme = i18n.global.tm('dateRange') as Record<string, string>;
      return Object.entries(scheme).filter((_, index) =>
        state.selected.title.includes('IPv4')
          ? index > 2
          : state.selected.version === '5'
          ? index > 0
          : _
      );
    },

    prolongRange: (state) => {
      const scheme = i18n.global.tm('dateRange') as Record<string, string>;
      return Object.entries(scheme).filter((_, index) =>
        state.selectedOrder.proxy === '6' ? _ : index > 2
      );
    },
  },
  actions: {
    setSystemUser(value: SystemUser) {
      this.systemUserValue = value;
    },
    setProxy(value: ProxyItem[]) {
      this.proxiesValue = value;
    },
    setUser(value: ProxyUser) {
      this.userValue = value;
      i18n.global.locale.value = proxyLanguageToLocale(this.userValue.language);
      Quasar.lang.set(this.userValue.language === 'ru' ? langRu : langEn);
    },

    select(value: ProxyItem) {
      this.selected = value;
    },

    deleteProxy(id: string) {
      useDialog(i18n.global.t('delete_warning')).onOk(() => {
        fetchProxy('deleteProxy', {
          order_org_id: id,
          user_id: this.userValue.id,
          user_secret_key: this.systemUserValue.secret_user_key,
          public_key: config.public_key,
        }).then();
      });
    },

    nullifyFilter() {
      this.filterOrders = new DefaultFilter();
    },
    findOrders<P extends keyof OrderFilter>(
      section: P,
      value: OrderFilterOf<P>
    ) {
      if (this.multiply === false) this.nullifyFilter();

      this.filterOrders[section] = value;
    },
  },
});
