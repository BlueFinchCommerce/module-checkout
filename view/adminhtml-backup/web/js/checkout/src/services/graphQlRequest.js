import axios from 'axios';
import getBaseUrl from '@/helpers/getBaseUrl';
import useConfigStore from '@/stores/ConfigStore';

export default (request) => {
  const { storeCode } = useConfigStore();
  const headers = {
    'content-type': 'application/json',
  };

  if (storeCode) {
    headers.Store = storeCode;
  }

  return axios({
    url: `${getBaseUrl()}/graphql`,
    method: 'post',
    data: { query: request },
    headers,
  }).then((response) => response.data);
};
