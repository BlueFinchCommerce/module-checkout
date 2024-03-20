import axios from 'axios';
import getBaseRestUrl from '@/helpers/storeConfigs/getBaseRestUrl';

export default (blockId) => (
  axios.get(`${getBaseRestUrl()}/cmsBlock/${blockId}`)
    .then((response) => response.data)
);
