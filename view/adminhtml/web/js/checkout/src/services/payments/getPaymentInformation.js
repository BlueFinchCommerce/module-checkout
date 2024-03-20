import useCartStore from '@/stores/CartStore';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';

export default async () => {
  const { maskedId } = useCartStore();

  let cartId;
  if (!maskedId) {
    cartId = await getMaskedIdFromGraphQl();
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
