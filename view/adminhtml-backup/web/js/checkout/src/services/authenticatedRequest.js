import useCustomerStore from '@/stores/CustomerStore';
import axios from 'axios';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import tokenTypes from '@/helpers/getTokenTypes';

export default () => {
  const instance = axios.create({
    baseURL: getBaseRestUrl(),
  });

  instance.interceptors.request.use(
    (config) => {
      const { customer: { token, tokenType } } = useCustomerStore();
      const customConfig = config;
      customConfig.headers['X-Requested-With'] = 'XMLHttpRequest';

      if (tokenType === tokenTypes.authKey) {
        customConfig.headers.Authorization = `Bearer ${token}`;
      } else if (tokenType === tokenTypes.phpSessionId || tokenType === tokenTypes.guestUser) {
        customConfig.withCredentials = true;
      }

      return customConfig;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};
