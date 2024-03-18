import axios from 'axios';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default (query, variables = {}, customHeaders = {}) => {
  const { storeCode } = useConfigStore();
  const headers = {
    'content-type': 'application/json',
    ...customHeaders,
  };

  if (storeCode) {
    headers.Store = storeCode;
  }

  return axios({
    url: `${getBaseUrl()}/graphql`,
    method: 'post',
    data: { query, variables },
    headers,
  }).then((response) => response.data);
};
