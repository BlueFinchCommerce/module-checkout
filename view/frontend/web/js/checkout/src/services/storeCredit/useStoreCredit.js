import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getAppliedStoreCredit from '@/helpers/cart/queryData/getAppliedStoreCredit';
import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';

export default async () => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyStoreCreditToCart(input: { cart_id: "${maskedId}" }) {
        cart {
          ${await getAppliedStoreCredit()}

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

      return response.data.applyStoreCreditToCart.cart;
    });
};
