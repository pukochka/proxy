import {
  roundBookmark,
  roundPerson,
  roundPayment,
} from '@quasar/extras/material-icons-round';

import { useLang } from 'src/utils/useLang';

const headerTabs = [
  {
    get label() {
      return useLang().payment;
    },
    name: 'payment',
    icon: roundPayment,
  },
  {
    get label() {
      return useLang().orders;
    },
    name: 'orders',
    icon: roundBookmark,
  },
  {
    get label() {
      return useLang().profile;
    },
    name: 'profile',
    icon: roundPerson,
  },
];

export { headerTabs };
