import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/cart/buildCartUrl';
import getNewsletterMutation from '@/services/newsletter/getNewsletterMutation';
import graphQlRequest from '@/services/graphQlRequest';

export default async (payment) => {
  const { tokens } = useRecaptchaStore();
  const paymentStore = usePaymentStore();

  const recaptchaToken = tokens.placeOrder || tokens.braintree || ''; // Ensures fallback to an empty string

  const headers = {
    'X-ReCaptcha': recaptchaToken,
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
        'g-recaptcha-response': recaptchaToken,
      },
      { headers },
    );

    return response.data;
  } catch (error) {
    paymentStore.setPaymentErrorMessage(error.response?.data?.message || 'Unknown payment error');
    throw error.response?.data || new Error('Payment request failed');
  }
};
