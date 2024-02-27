import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

export default () => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      removeStoreCreditFromCart(input: { cart_id: "${maskedId}" }) {
        cart {
          id
        }
      }
    }`;
  return graphQlRequest(request);
};
