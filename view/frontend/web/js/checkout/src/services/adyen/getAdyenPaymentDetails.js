import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';

export default (payload) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation getAdyenPaymentDetails($payload: String!, $cartId: String!) {
      adyenPaymentDetails(payload:  $payload, cart_id: $cartId) {
        isFinal
        resultCode
        additionalData
        action
      }
  }`;

  const variables = {
    cartId: maskedId,
    payload,
  };

  return graphQlRequest(request, variables)
    .then((response) => response.data.adyenPaymentDetails);
};
