import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';
import getFullCart from '@/helpers/cart/getFullCart';

export default async (email) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation {
      setGuestEmailOnCart(
        input: {
          cart_id: "${maskedId}"
          email: "${email}"
        }
      ) {
        cart {
          ${await getFullCart()}
        }
      }
    }`;

  return graphQlRequest(request)
    .then(((response) => response.data.setGuestEmailOnCart.cart));
};
