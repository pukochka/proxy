import type { AxiosResponse } from 'axios';
import { useDialog } from 'src/utils/useDialog';
import type { ProxyApiResponse } from 'src/api/types';
import { ProxyApiError } from 'src/api/types';

export function unwrapProxy<T>(
  res: AxiosResponse<ProxyApiResponse<T>>,
  options: { allowUndefinedData: true },
): T | undefined;
export function unwrapProxy<T>(
  res: AxiosResponse<ProxyApiResponse<T>>,
  options?: { allowUndefinedData?: false },
): T;
export function unwrapProxy<T>(
  res: AxiosResponse<ProxyApiResponse<T>>,
  options?: { allowUndefinedData?: boolean },
): T | undefined {
  const body = res.data;
  if (!body || body.result !== true) {
    const msg =
      typeof body?.message === 'string' && body.message
        ? body.message
        : 'Request failed';
    useDialog(msg, true);
    throw new ProxyApiError(msg, body);
  }
  if (body.data === undefined && !options?.allowUndefinedData) {
    const msg = 'Empty data';
    useDialog(msg, true);
    throw new ProxyApiError(msg, body);
  }
  return body.data as T | undefined;
}
