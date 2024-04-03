import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';

export default async (orderId) => {
  const { maskedId, getMaskedId } = useCartStore();

  let cartId;
  if (!maskedId) {
    cartId = await getMaskedId();
  } else {
    cartId = maskedId;
  }

  const request = ` {
    adyenPaymentStatus(orderNumber: "${orderId}", cartId: "${cartId}") {
      action
      additionalData
      isFinal
      resultCode
    }
  } `;

  return graphQlRequest(request)
    .then((response) => ({
      ...response.data.adyenPaymentStatus,
      action: JSON.parse(response.data.adyenPaymentStatus.action),
    }));
};
