import { Dialog } from 'quasar';
import { useLang } from 'src/utils/useLang';

export function useDialog(message: string, error?: boolean) {
  const lang = useLang();

  const buttons = error
    ? {
        ok: {
          noCaps: true,
          label: 'OK',
          class: 'rounded-10',
          unelevated: true,
          color: 'secondary',
        },
      }
    : {
        ok: {
          noCaps: true,
          label: lang.confirm,
          class: 'rounded-10',
          unelevated: true,
          color: 'red',
        },
        cancel: {
          noCaps: true,
          label: lang.cancel,
          class: 'rounded-10',
          color: 'secondary',
          unelevated: true,
        },
      };

  return Dialog.create({
    message: message,
    class: 'rounded-10',
    html: true,
    ...buttons,
  });
}
