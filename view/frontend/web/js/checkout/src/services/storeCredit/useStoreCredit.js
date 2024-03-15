import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/cart/getFullCart';

export default () => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyStoreCreditToCart(input: { cart_id: "${maskedId}" }) {
        cart {
          ${getFullCart}
        }
      }
    }`;
  return graphQlRequest(request);
};
