import {
  roundBookmark,
  roundPerson,
  roundPayment,
} from '@quasar/extras/material-icons-round';

import { i18n } from 'src/i18n';

const headerTabs = [
  {
    get label() {
      return i18n.global.t('payment');
    },
    name: 'payment',
    icon: roundPayment,
  },
  {
    get label() {
      return i18n.global.t('orders');
    },
    name: 'orders',
    icon: roundBookmark,
  },
  {
    get label() {
      return i18n.global.t('profile');
    },
    name: 'profile',
    icon: roundPerson,
  },
];

export { headerTabs };
