import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getAppliedCoupons from '@/helpers/cart/queryData/getAppliedCoupons';
import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';

export default async (coupon) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyCouponToCart(input: {
        cart_id: "${maskedId}"
        coupon_code: "${coupon}"
      }) {
        cart {
          ${await getAppliedCoupons()}

          ${await getItems()}

          ${await getPaymentMethods()}

          ${await getPrices()}

          ${await getShippingAddresses()}
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
