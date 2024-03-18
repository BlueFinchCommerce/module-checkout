import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/cart/buildCartUrl';

export default (payment) => {
  const { tokens } = useRecaptchaStore();

  const headers = {
    'X-ReCaptcha': tokens.placeOrder,
    'X-Requested-With': 'XMLHttpRequest',
  };

  console.log(payment);

  return authenticatedRequest().post(
    buildCartUrl('payment-information'),
    {
      ...payment,
      'g-recaptcha-response': tokens.placeOrder,
    },
    { headers },
  ).then((response) => response.data);
};
