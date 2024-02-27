import axios from 'axios';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';

export default (customerEmail, controller) => (
  axios.post(`${getBaseRestUrl()}/customers/isEmailAvailable`, {
    customerEmail,
  }, {
    signal: controller.signal,
  }).then((response) => response.data)
);
