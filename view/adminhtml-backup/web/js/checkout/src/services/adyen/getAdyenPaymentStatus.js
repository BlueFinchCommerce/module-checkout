import useCartStore from '@/stores/CartStore';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';

export default async (orderId) => {
  const { maskedId } = useCartStore();

  let cartId;
  if (!maskedId) {
    cartId = await getMaskedIdFromGraphQl();
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
