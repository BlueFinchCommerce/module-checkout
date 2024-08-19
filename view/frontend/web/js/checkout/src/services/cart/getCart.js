import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';
import getFullCart from '@/helpers/cart/getFullCart';

export default async () => {
  const { maskedId } = useCartStore();

  const request = `{
    cart(cart_id: "${maskedId}") {
      ${await getFullCart()}
    }
  }`;

  return graphQlRequest(request)
    .then((response) => response.data.cart);
};
