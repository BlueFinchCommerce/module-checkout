import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/cart/buildCartUrl';
import getNewsletterMutation from '@/services/newsletter/getNewsletterMutation';
import graphQlRequest from '@/services/graphQlRequest';

export default async (payment) => {
  const { tokens } = useRecaptchaStore();
  const paymentStore = usePaymentStore();

  const headers = {
    'X-ReCaptcha': tokens.placeOrder ? tokens.placeOrder : tokens.braintree,
    'X-Requested-With': 'XMLHttpRequest',
  };

  const newsletterMutation = getNewsletterMutation();
  if (newsletterMutation) {
    const request = `
      mutation {
        ${newsletterMutation}
      }
    `;
    await graphQlRequest(request, {}, {}, 'BetterCheckoutNewsletter');
  }

  try {
    const response = await authenticatedRequest().post(
      buildCartUrl('payment-information'),
      {
        ...payment,
        'g-recaptcha-response': tokens.placeOrder ? tokens.placeOrder : tokens.braintree,
      },
      { headers },
    );

    return response.data;
  } catch (error) {
    paymentStore.setPaymentErrorMessage(error.response.data.message);
    throw error.response?.data || new Error('Payment request failed');
  }
};
