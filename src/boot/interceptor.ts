import axios from 'axios';
import config from 'src/config';
import { useStatesStore } from 'stores/states/statesStore';

import { LoadingNames } from 'stores/states/models';
import { useDialog } from 'src/utils/useDialog';

const proxy = axios.create({
  baseURL: config.domain_proxy,
  method: 'get',
});

const bott = axios.create({
  baseURL: config.domain_bott,
  method: 'post',
});

for (const instance of [proxy, bott]) {
  instance.interceptors.request.use(function (config) {
    const states = useStatesStore();

    states.startLoading(<LoadingNames>config.url);
    return config;
  });

  instance.interceptors.response.use(
    function (response) {
      const states = useStatesStore();

      states.endLoading(<LoadingNames>response.config.url);
      if (response.data.result === true) {
        return response;
      } else {
        useDialog(response.data.message, true);

        return Promise.reject('error');
      }
    },
    function () {
      useDialog(
        'Произошла ошибка сервера, обратитеcь в поддержку сервиса',
        true
      );
    }
  );
}

export { bott, proxy };
