import config from 'src/config';
import { getHash } from 'src/utils/string';
import type { ProxyApiResponse } from 'src/api/types';
import { bottApi } from 'src/api/instance';
import { unwrapProxy } from 'src/api/unwrap';

export class BottCheckHashService {
  static async checkHash(): Promise<SystemUser> {
    const res = await bottApi.post<ProxyApiResponse<SystemUser>>({
      url: 'module/bot/check-hash',
      data: {
        bot_id: config.bot_id,
        userData: getHash(),
        },
    });
    return unwrapProxy(res);
  }
}
