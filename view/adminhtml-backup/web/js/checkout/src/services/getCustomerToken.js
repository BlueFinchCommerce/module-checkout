import axios from 'axios';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import handleServiceError from '@/helpers/handleServiceError';

export default (username, password) => (
  axios.post(`${getBaseRestUrl()}/integration/customer/token`, {
    username,
    password,
  })
    .then((response) => response.data)
    .catch(handleServiceError)
);
