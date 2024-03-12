import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/getFullCart';

export default (item, change) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      updateCartItems(input: {
        cart_id: "${maskedId}"
        cart_items: [{
          cart_item_uid: "${item.uid}"
          quantity: "${item.quantity + change}"
          customizable_options: []
        }]
      }) {
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

      return response.data.updateCartItems.cart;
    });
};
