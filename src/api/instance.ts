import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from 'src/config';
import { useStatesStore } from 'stores/states/statesStore';
import type { LoadingNames } from 'stores/states/models';
import { useDialog } from 'src/utils/useDialog';

export const proxyClient = axios.create({
  baseURL: config.domain_proxy,
  method: 'get',
});

export const bottClient = axios.create({
  baseURL: config.domain_bott,
  method: 'post',
});

function attachLoadingInterceptors(client: typeof proxyClient) {
  client.interceptors.request.use((requestConfig) => {
    const states = useStatesStore();
    states.startLoading(requestConfig.url as LoadingNames);
    return requestConfig;
  });

  client.interceptors.response.use(
    (response) => {
      const states = useStatesStore();
      states.endLoading(response.config.url as LoadingNames);
      return response;
    },
    (error) => {
      const states = useStatesStore();
      const url = error.config?.url as LoadingNames | undefined;
      if (url) {
        states.endLoading(url);
      }
      useDialog(
        'Произошла ошибка сервера, обратитеcь в поддержку сервиса',
        true,
      );
      return Promise.reject(error);
    },
  );
}

attachLoadingInterceptors(proxyClient);
attachLoadingInterceptors(bottClient);

export const proxyApi = {
  async get<T = unknown>(
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return proxyClient.request<T>({ ...requestConfig, method: 'get' });
  },
  async post<T = unknown>(
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return proxyClient.request<T>({ ...requestConfig, method: 'post' });
  },
};

export const bottApi = {
  async post<T = unknown>(
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return bottClient.request<T>({ ...requestConfig, method: 'post' });
  },
};
