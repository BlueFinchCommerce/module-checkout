import axios from 'axios';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

const getFormKey = () => {
  const match = document.cookie.match(/(?:^|;\s*)form_key=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

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
    formKey: getFormKey(),
    'g-recaptcha-response': tokens.customerLogin,
  }, { headers })
    .then(({ data }) => {
      if (data.errors) {
        throw new Error(data.message);
      }
      return data;
    });
};
