import axios from 'axios';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default (query, variables = {}, customHeaders = {}) => {
  const { secureBaseLinkUrl, storeCode } = useConfigStore();
  const headers = {
    'content-type': 'application/json',
    ...customHeaders,
  };

  if (storeCode) {
    headers.Store = storeCode;
  }

  const base = secureBaseLinkUrl || `${getBaseUrl()}/`;

  return axios({
    url: `${base}graphql`,
    method: 'post',
    data: { query, variables },
    headers,
  }).then((response) => response.data);
};
