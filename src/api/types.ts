export interface ProxyApiResponse<T = unknown> {
  result: boolean;
  message?: string;
  data?: T;
}

export class ProxyApiError extends Error {
  constructor(
    message: string,
    public readonly payload?: ProxyApiResponse<unknown>,
  ) {
    super(message);
    this.name = 'ProxyApiError';
  }
}
