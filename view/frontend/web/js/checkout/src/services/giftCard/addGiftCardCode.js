import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/cart/getFullCart';

export default async (code) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyGiftCardToCart(input: {
        cart_id: "${maskedId}"
        gift_card_code: "${code}"
      }) {
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

      return response.data.applyGiftCardToCart.cart;
    });
};
