import useCartStore from '@/stores/CartStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

import beforePaymentRequest from '@/services/customer/refreshCustomerData';
import getNewsletterMutation from '@/services/newsletter/getNewsletterMutation';

import paymentComplete from '@/helpers/dataLayer/paymentCompleteDataLayer';

import graphQlRequest from '@/services/graphQlRequest';

export default (paymentMethod) => {
  const { maskedId } = useCartStore();
  const { tokens } = useRecaptchaStore();

  const request = `
    mutation PlaceOrder($cartId: String!, $paymentMethod: PaymentMethodInput!) {
      ${getNewsletterMutation()}

      setPayment: setPaymentMethodOnCart(input: {
        cart_id: $cartId
        payment_method: $paymentMethod
      }) {
        cart {
          id
        }
      }

      placeOrder: placeOrder(input: {
        cart_id: $cartId
      }) {
        order {
          order_number
        }
      }
    }`;

  const variables = {
    cartId: maskedId,
    paymentMethod,
  };

  const customHeaders = {};

  if (tokens.placeOrder || tokens.braintree) {
    customHeaders['X-ReCaptcha'] = tokens.placeOrder ? tokens.placeOrder : tokens.braintree;
  }

  return beforePaymentRequest()
    .then(() => graphQlRequest(request, variables, customHeaders, 'BlueFinchCheckoutPlaceOrder'))
    .then((response) => {
      if (response?.errors) {
        throw new Error(response.errors[0].message);
      } else if (response?.data?.placeOrder?.errors) {
        throw new Error(response.data.placeOrder.errors[0].message);
      }

      // Add tracking in on payment complete.
      paymentComplete();

      return response.data.placeOrder.order.order_number;
    });
};
