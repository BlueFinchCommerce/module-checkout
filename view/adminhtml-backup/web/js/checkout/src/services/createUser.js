import axios from 'axios';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import getWebsiteId from '../helpers/getWebsiteId';

export default (email, password) => (
  axios.post(`${getBaseRestUrl()}/customers`, {
    customer: {
      email,
      firstname: '',
      lastname: '',
      website_id: getWebsiteId(),
    },
    password,
  }).then((response) => response.data)
);
