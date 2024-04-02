import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';

export default async () => {
  const { maskedId, getMaskedId } = useCartStore();

  let cartId;
  if (!maskedId) {
    cartId = await getMaskedId();
  } else {
    cartId = maskedId;
  }

  const request = ` {
  cart(cart_id: "${cartId}") {
    available_payment_methods {
      code
      title
    }
  }
} `;

  return graphQlRequest(request)
    .then((response) => response.data.cart.available_payment_methods);
};
