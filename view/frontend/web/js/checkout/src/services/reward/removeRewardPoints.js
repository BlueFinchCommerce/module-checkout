import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/cart/getFullCart';

export default async () => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      removeRewardPointsFromCart(cartId: "${maskedId}") {
        cart {
          ${await getFullCart()}
        }
      }
    }`;
  return graphQlRequest(request)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.removeRewardPointsFromCart.cart;
    });
};
