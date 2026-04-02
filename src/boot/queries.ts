import config from 'src/config';
import { ProxyService } from 'src/api/services/proxyService';
import { BottCheckHashService } from 'src/api/services/bottCheckHashService';
import { useDataStore } from 'stores/data/dataStore';
import { useStatesStore } from 'stores/states/statesStore';
import { LocalStorage, Notify, setCssVar } from 'quasar';
import { i18n } from 'src/i18n';
import { colors } from 'src/utils/colors';
import { assertNever } from 'src/utils/assertNever';

async function runFetchProxy(
  query: ProxyQueries,
  params: ProxyParams<ProxyQueries> | undefined,
  open?: boolean,
) {
  const data = useDataStore();
  const states = useStatesStore();
  try {
    switch (query) {
      case 'getProxy': {
        const list = await ProxyService.getProxy(
          params as ProxyGetProxyParams,
        );
        data.setProxy(list);
        states.loadings.init = false;
        break;
      }

      case 'getUser': {
        const user = await ProxyService.getUser(params as ProxyGetUserParams);
        data.setUser(user);
        await fetchProxy('getProxy', { public_key: config.public_key });
        await fetchProxy('getOrders', {
          user_id: data.userValue.id,
          public_key: config.public_key,
          user_secret_key: data.systemUserValue.secret_user_key,
        });
        break;
      }

      case 'getOrders': {
        const orders = await ProxyService.getOrders(
          params as ProxyGetOrdersParams,
        );
        data.ordersValue = orders ?? [];
        break;
      }

      case 'buyProxy': {
        const created = await ProxyService.buyProxy(
          params as ProxyBuyProxyParams,
        );
        states.closeDialog('build');
        await fetchProxy('getOrders', {
          user_id: data.userValue.id,
          public_key: config.public_key,
          user_secret_key: data.systemUserValue.secret_user_key,
        });
        Notify.create({
          message: i18n.global.t('success_purchase', {
            count: data.payment.count,
          }),
          position: 'top',
          classes: 'rounded',
          textColor: 'white',
          timeout: 2000,
        });
        states.tab = 'orders';
        const first = created?.[0];
        if (first) {
          data.selectedOrder = first;
          states.openDialog('view');
        }
        break;
      }

      case 'prolongProxy': {
        const order = await ProxyService.prolongProxy(
          params as ProxyProlongProxyParams,
        );
        if (order) {
          data.selectedOrder = order;
        }
        break;
      }

      case 'getCount': {
        const count = await ProxyService.getCount(
          params as ProxyGetCountParams,
        );
        data.range.max = count ?? 0;
        if (open) {
          states.openDialog('build');
        }
        break;
      }

      case 'getPrice': {
        const quote = await ProxyService.getPrice(
          params as ProxyGetPriceParams,
        );
        data.payment = quote ?? {
          period: 30,
          price: 0,
          price_single: 0,
          count: 0,
        };
        if (open) {
          states.openDialog('prolong_menu');
        }
        break;
      }

      case 'getCountry': {
        const p = params as ProxyGetCountryParams;
        const countries = (await ProxyService.getCountry(p)) ?? [];
        const idx = data.proxiesValue.findIndex((x) => x.version === p.version);
        if (idx >= 0) {
          const next = [...data.proxiesValue];
          next[idx] = { ...next[idx], countries };
          data.setProxy(next);
        }
        if (data.selected.version === p.version) {
          data.select({ ...data.selected, countries });
        }
        break;
      }

      case 'updateType': {
        await ProxyService.updateType(params as ProxyUpdateTypeParams);
        data.selectedOrder.type =
          (params as ProxyUpdateTypeParams).type ?? 'http';
        break;
      }

      case 'setLanguage': {
        const user = await ProxyService.setLanguage(
          params as ProxySetLangParams,
        );
        data.setUser(user);
        break;
      }

      case 'getSettings': {
        const settingId = await ProxyService.getSettings(params as PublicKey);
        const color =
          colors.find((item) => item.id === Number(settingId)) ?? colors[0];
        setCssVar('primary', color.primary);
        setCssVar('secondary', color.secondary);
        LocalStorage.set('_bott-primary', color.primary);
        LocalStorage.set('_bott-secondary', color.secondary);
        break;
      }

      case 'deleteProxy': {
        const p = params as ProxyCheckWorkParams;
        await ProxyService.deleteProxy(p);
        data.ordersValue = data.ordersValue.filter(
          (item) => item.order_org_id !== p.order_org_id,
        );
        break;
      }

      case 'checkWork': {
        const ok = await ProxyService.checkWork(params as ProxyCheckWorkParams);
        const color = ok ? 'green' : 'red';
        const message = ok
          ? i18n.global.t('check_success')
          : i18n.global.t('check_fail');
        Notify.create({
          message,
          position: 'top',
          classes: 'rounded',
          color,
          textColor: 'white',
          timeout: 2000,
        });
        break;
      }

      default:
        assertNever(query);
    }
  } catch {
    /* intentional: preserve previous fire-and-forget behavior */
  }
}

export async function fetchProxy<Q extends ProxyQueries>(
  query: Q,
  params?: ProxyParams<Q>,
  open?: boolean,
) {
  return runFetchProxy(
    query,
    params as ProxyParams<ProxyQueries> | undefined,
    open,
  );
}

export async function fetchUser() {
  const data = useDataStore();

  try {
    const systemUser = await BottCheckHashService.checkHash();
    data.setSystemUser(systemUser);
    await fetchProxy('getUser', {
      user_id: systemUser.user.telegram_id,
    });
  } catch {
    /* intentional */
  }
}
