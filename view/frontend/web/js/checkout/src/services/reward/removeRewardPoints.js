import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getRewardPoints from '@/helpers/cart/queryData/getRewardPoints';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';

export default async () => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      removeRewardPointsFromCart(cartId: "${maskedId}") {
        cart {
          ${await getItems()}

          ${await getPaymentMethods()}

          ${await getPrices()}

          ${await getRewardPoints()}

          ${await getShippingAddresses()}
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
