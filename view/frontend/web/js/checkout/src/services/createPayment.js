import useCustomerStore from '@/stores/CustomerStore';
import useCartStore from '@/stores/CartStore';
import useRecaptchaStore from '@/stores/RecaptchaStore';

import beforePaymentRequest from '@/services/beforePaymentRequest';
import graphQlRequest from './graphQlRequest';
import tokenTypes from '@/helpers/getTokenTypes';

export default (paymentMethod) => {
  const { maskedId } = useCartStore();
  const { customer: { tokenType } } = useCustomerStore();
  const { tokens } = useRecaptchaStore();

  const request = `
    mutation PlaceOrder($cartId: String!, $paymentMethod: PaymentMethodInput!) {
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

  if (tokens.placeOrder) {
    customHeaders['X-ReCaptcha'] = tokens.placeOrder;
  }

  return beforePaymentRequest()
    .then(() => graphQlRequest(request, variables, customHeaders))
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
        return;
      }

      return response.data.placeOrder.order.order_number
    });
};
