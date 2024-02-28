import axios from 'axios';
import useConfigStore from '@/stores/ConfigStore';

export default (username, password) => {
  const { secureBaseUrl } = useConfigStore();

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  };

  return axios.post(`${secureBaseUrl}customer/ajax/login`, {
    username,
    password,
    context: 'checkout',
  }, { headers })
    .then(({ data }) => {
      if (data.errors) {
        throw new Error(data.message);
      }
      return data;
    });
};
