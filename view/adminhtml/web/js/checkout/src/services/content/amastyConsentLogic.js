import axios from 'axios';
import getBaseRestUrl from '@/helpers/storeConfigs/getBaseRestUrl';

export default (email) => (
  axios.post(`${getBaseRestUrl()}/consent/getStatuses`, {
    email,
  }).then((response) => response.data)
);
