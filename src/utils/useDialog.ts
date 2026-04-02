import { Dialog } from 'quasar';

import { i18n } from 'src/i18n';

export function useDialog(message: string, error?: boolean) {
  const buttons = error
    ? {
        ok: {
          noCaps: true,
          label: 'OK',
          class: 'rounded',
          unelevated: true,
          color: 'secondary',
        },
      }
    : {
        ok: {
          noCaps: true,
          label: i18n.global.t('confirm'),
          class: 'rounded',
          unelevated: true,
          color: 'red',
        },
        cancel: {
          noCaps: true,
          label: i18n.global.t('cancel'),
          class: 'rounded',
          color: 'secondary',
          unelevated: true,
        },
      };

  return Dialog.create({
    message: message,
    class: 'rounded',
    html: true,
    ...buttons,
  });
}
