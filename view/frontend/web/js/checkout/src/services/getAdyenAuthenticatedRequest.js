import axios from 'axios';
import useAdyenStore from '@/stores/AdyenStore';
import useCustomerStore from '@/stores/CustomerStore';
import tokenTypes from '@/helpers/getTokenTypes';

const getAccessToken = () => {
  const adyenStore = useAdyenStore();
  const { adyenAuthToken } = adyenStore;

  if (adyenAuthToken) {
    return adyenAuthToken;
  }

  const customerStore = useCustomerStore();
  const { customer: { token, tokenType } } = customerStore;
  return tokenType === tokenTypes.authKey
    ? token
    : null;
};

export default (method, url, params) => {
  const accessToken = getAccessToken();
  const options = accessToken
    ? {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    : {
      headers: {},
    };
  options.headers['X-Requested-With'] = 'XMLHttpRequest';
  return axios[method](url, params, options);
};
