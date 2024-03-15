import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/getFullCart';

export default () => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyRewardPointsToCart(cartId: "${maskedId}") {
        cart {
          ${getFullCart}
        }
      }
    }`;
  return graphQlRequest(request)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.applyRewardPointsToCart.cart;
    });
};
