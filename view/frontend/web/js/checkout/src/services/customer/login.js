import axios from 'axios';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

export default (username, password) => {
  const { secureBaseUrl } = useConfigStore();
  const { tokens } = useRecaptchaStore();

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  };

  return axios.post(`${secureBaseUrl}customer/ajax/login`, {
    username,
    password,
    context: 'checkout',
    'g-recaptcha-response': tokens.customerLogin,
  }, { headers })
    .then(({ data }) => {
      if (data.errors) {
        throw new Error(data.message);
      }
      return data;
    });
};
