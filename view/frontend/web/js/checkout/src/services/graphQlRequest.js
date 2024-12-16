import axios from 'axios';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default (query, variables = {}, customHeaders = {}, operationName = null) => {
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
    data: { query, operationName, variables },
    headers,
  }).then((response) => response.data);
};
