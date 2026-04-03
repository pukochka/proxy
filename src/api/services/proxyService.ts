import type { ProxyApiResponse } from 'src/api/types';
import { proxyApi } from 'src/api/instance';
import { unwrapProxy } from 'src/api/unwrap';

export interface ProxyPaymentQuote {
  period: number;
  price: number;
  price_single: number;
  count: number;
}

export class ProxyService {
  private static async getQuery<T>(url: string, params: object) {
    return proxyApi.get<ProxyApiResponse<T>>({ url, params });
  }

  static async getProxy(params: ProxyGetProxyParams): Promise<ProxyItem[]> {
    const res = await this.getQuery<ProxyItem[]>('getProxy', params);
    return unwrapProxy(res);
  }

  static async getUser(params: ProxyGetUserParams): Promise<ProxyUser> {
    const res = await this.getQuery<ProxyUser>('getUser', params);
    return unwrapProxy(res);
  }

  static async getOrders(
    params: ProxyGetOrdersParams
  ): Promise<ProxyOrder[] | undefined> {
    const res = await this.getQuery<ProxyOrder[]>('getOrders', params);
    return unwrapProxy(res, { allowUndefinedData: true });
  }

  static async getSettings(params: PublicKey): Promise<string> {
    const res = await this.getQuery<string>('getSettings', params);
    return unwrapProxy(res);
  }

  static async getCountry(
    params: ProxyGetCountryParams
  ): Promise<ProxyCountry[] | undefined> {
    const res = await this.getQuery<ProxyCountry[]>('getCountry', params);
    return unwrapProxy(res, { allowUndefinedData: true });
  }

  static async getCount(
    params: ProxyGetCountParams
  ): Promise<number | undefined> {
    const res = await this.getQuery<number>('getCount', params);
    return unwrapProxy(res, { allowUndefinedData: true });
  }

  static async getPrice(
    params: ProxyGetPriceParams
  ): Promise<ProxyPaymentQuote | undefined> {
    const res = await this.getQuery<ProxyPaymentQuote>('getPrice', params);
    return unwrapProxy(res, { allowUndefinedData: true });
  }

  static async buyProxy(
    params: ProxyBuyProxyParams
  ): Promise<ProxyOrder[] | undefined> {
    const res = await this.getQuery<ProxyOrder[]>('buyProxy', params);
    return unwrapProxy(res, { allowUndefinedData: true });
  }

  static async prolongProxy(
    params: ProxyProlongProxyParams
  ): Promise<ProxyOrder | undefined> {
    const res = await this.getQuery<ProxyOrder>('prolongProxy', params);
    return unwrapProxy(res, { allowUndefinedData: true });
  }

  static async updateType(params: ProxyUpdateTypeParams): Promise<void> {
    const res = await this.getQuery<unknown>('updateType', params);
    unwrapProxy(res, { allowUndefinedData: true });
  }

  static async deleteProxy(params: ProxyCheckWorkParams): Promise<void> {
    const res = await this.getQuery<unknown>('deleteProxy', params);
    unwrapProxy(res, { allowUndefinedData: true });
  }

  static async checkWork(params: ProxyCheckWorkParams): Promise<boolean> {
    const res = await this.getQuery<boolean>('checkWork', params);
    return unwrapProxy(res);
  }

  static async setLanguage(params: ProxySetLangParams): Promise<ProxyUser> {
    const res = await this.getQuery<ProxyUser>('setLanguage', params);
    return unwrapProxy(res);
  }
}
