import useCustomerStore from '@/stores/CustomerStore';
import useCartStore from '@/stores/CartStore';
import useRecaptchaStore from '@/stores/RecaptchaStore';

import beforePaymentRequest from '@/services/beforePaymentRequest';
import graphQlRequest from './graphQlRequest';
import tokenTypes from '@/helpers/getTokenTypes';

export default (paymentMethod) => {
  const { maskedId } = useCartStore();
  const { customer: { email, tokenType } } = useCustomerStore();
  const { tokens } = useRecaptchaStore();

  // If we are a guest we need to set the email back to the quote first.
  const setGuestEmailOnCart = tokenType === tokenTypes.guestUser
    ? `setEmail: setGuestEmailOnCart(input: {
        cart_id: $cartId
        email: $email
      }) {
        cart {
          id
        }
      }`
    : '';

  const request = `
    mutation PlaceOrder($cartId: String!, $email: String!, $paymentMethod: PaymentMethodInput!) {
      ${setGuestEmailOnCart}

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
    email,
    paymentMethod,
  };

  const customHeaders = {};

  if (tokens.placeOrder) {
    customHeaders['X-ReCaptcha'] = tokens.placeOrder;
  }

  return beforePaymentRequest()
    .then(() => graphQlRequest(request, variables, customHeaders))
    .then(({ data }) => data.placeOrder.order.order_number);
};
