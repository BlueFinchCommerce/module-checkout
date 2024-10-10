import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';
import getFullCart from '@/helpers/cart/getFullCart';

export default async (coupon) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyCouponToCart(input: {
        cart_id: "${maskedId}"
        coupon_code: "${coupon}"
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

      return response.data.applyCouponToCart.cart;
    });
};
