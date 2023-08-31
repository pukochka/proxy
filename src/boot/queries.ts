import config from 'src/config';

import { bott, proxy } from 'boot/interceptor';
import { useDataStore } from 'stores/data/dataStore';

import { getHash } from 'src/utils/string';
import { useStatesStore } from 'stores/states/statesStore';
import { Notify, setCssVar } from 'quasar';

import { useLang } from 'src/utils/useLang';

import { colors } from 'src/utils/colors';

export async function fetchProxy<Q extends ProxyQueries>(
  query: Q,
  params?: ProxyParams<Q>,
  open?: boolean
) {
  const data = useDataStore();
  const states = useStatesStore();
  const lang = useLang();

  try {
    return await proxy({ url: query, params: params }).then((response) => {
      /** */
      if (query === 'getProxy') {
        /** */

        data.setProxy(response.data.data);

        states.loadings.init = false;

        /** */
      } else if (query === 'getUser') {
        /** */

        data.setUser(response.data.data);

        fetchProxy('getProxy', { public_key: config.public_key });
        fetchProxy('getOrders', {
          user_id: data.userValue.id,
          public_key: config.public_key,
          user_secret_key: data.systemUserValue.secret_user_key,
        });

        /** */
      } else if (query === 'getOrders') {
        /** */

        data.ordersValue = response.data.data ?? [];

        /** */
      } else if (query === 'buyProxy') {
        /** */

        states.closeDialog('build');
        fetchProxy('getOrders', {
          user_id: data.userValue.id,
          public_key: config.public_key,
          user_secret_key: data.systemUserValue.secret_user_key,
        });
        Notify.create({
          message: lang.success + data.payment.count.toString() + ' Proxy!',
          position: 'top',
          classes: 'rounded-10',
          textColor: 'white',
          timeout: 2000,
        });

        /** */
      } else if (query === 'prolongProxy') {
        /** */

        if (response.data.data) {
          data.selectedOrder = response.data.data;
        }

        /** */
      } else if (query === 'getCount') {
        /** */

        data.range.max = response.data.data ?? 0;

        if (open) states.openDialog('build');

        /** */
      } else if (query === 'getPrice') {
        /** */

        data.payment = response.data.data ?? {
          period: 30,
          price: 0,
          price_single: 0,
          count: 0,
        };
        if (open) states.openDialog('prolong_menu');

        /** */
      } else if (query === 'getOrders') {
        /** */

        data.ordersValue = response.data.data ?? [];

        /** */
      } else if (query === 'updateType') {
        /** */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.selectedOrder.type = params?.['type'] ?? 'http';

        /** */
      } else if (query === 'setLanguage') {
        /** */

        data.setUser(response.data.data);

        /** */
      } else if (query === 'getSettings') {
        /** */

        const color =
          colors.find((item) => item.id === response.data.data) ?? colors[0];

        setCssVar('primary', color.primary);
        setCssVar('secondary', color.secondary);

        /** */
      } else if (query === 'deleteProxy') {
        /** */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const id = params?.['order_org_id'];

        data.ordersValue = data.ordersValue.filter(
          (item) => item.order_org_id !== id ?? ''
        );

        /** */
      } else if (query === 'checkWork') {
        /** */

        const color = response.data.data ? 'green' : 'red';

        const message = response.data.data
          ? lang.check_success
          : lang.check_fail;

        Notify.create({
          message: message,
          position: 'top',
          classes: 'rounded-10',
          color: color,
          textColor: 'white',
          timeout: 2000,
        });

        /** */
      }
      /** */
    });
  } catch (e) {}
}

export async function fetchUser() {
  const data = useDataStore();

  try {
    return await bott({
      url: 'module/bot/check-hash',
      data: {
        bot_id: config.bot_id,
        userData: getHash(),
      },
    }).then((response) => {
      /** */

      data.setSystemUser(response.data.data);

      fetchProxy('getUser', { user_id: response.data.data.user.telegram_id });

      /** */
    });
  } catch (e) {}
}
