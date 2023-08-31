import { defineStore } from 'pinia';
import {
  DialogNames,
  LoadingNames,
  StatesModel,
  TabNames,
} from 'stores/states/models';
import config from 'src/config';

export const useStatesStore = defineStore('states', {
  state: () =>
    ({
      tab: 'payment',

      dialogs: {
        date_menu: false,
        count_menu: false,
        country_menu: false,
        type_menu: false,
        prolong_menu: false,

        type_filter: false,
        ip_filter: false,
        date_filter: false,

        build: false,
        view: false,
      },

      loadings: {
        getPrice: false,
        getProxy: false,
        getCount: false,
        deleteProxy: false,
        updateType: false,
        init: true,
      },
    } as StatesModel),
  getters: {
    itemBackgroundClass: () => (config.dark ? ' bg-dark' : ' bg-item'),
  },
  actions: {
    toggleTab(name: TabNames) {
      this.tab = name;
    },
    openDialog(name: DialogNames) {
      this.dialogs[name] = true;
    },
    closeDialog(name: DialogNames) {
      this.dialogs[name] = false;
    },

    startLoading(name: LoadingNames) {
      this.loadings[name] = true;
    },
    endLoading(name: LoadingNames) {
      this.loadings[name] = false;
    },
  },
});
