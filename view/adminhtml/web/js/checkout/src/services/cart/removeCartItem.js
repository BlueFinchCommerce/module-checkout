import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/cart/getFullCart';

export default (uid) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      removeItemFromCart(input: {
        cart_id: "${maskedId}"
        cart_item_uid: "${uid}"
      }) {
        cart {
          ${getFullCart()}
        }
      }
    }`;
  return graphQlRequest(request)
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.removeItemFromCart.cart;
    });
};
