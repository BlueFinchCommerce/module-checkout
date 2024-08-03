import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/cart/buildCartUrl';
import getNewsletterMutation from '@/services/newsletter/getNewsletterMutation';
import graphQlRequest from '@/services/graphQlRequest';

export default async (payment) => {
  const { tokens } = useRecaptchaStore();

  const headers = {
    'X-ReCaptcha': tokens.placeOrder,
    'X-Requested-With': 'XMLHttpRequest',
  };

  const newsletterMutation = getNewsletterMutation();
  if (newsletterMutation) {
    const request = `
      mutation {
        ${newsletterMutation}
      }
    `;
    await graphQlRequest(request);
  }

  return authenticatedRequest().post(
    buildCartUrl('payment-information'),
    {
      ...payment,
      'g-recaptcha-response': tokens.placeOrder,
    },
    { headers },
  ).then((response) => response.data);
};
