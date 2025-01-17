import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getIsVirtual from '@/helpers/cart/queryData/getIsVirtual';
import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
import getEmailField from '@/helpers/cart/queryData/getEmailField';

export default async (uid) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      removeItemFromCart(input: {
        cart_id: "${maskedId}"
        cart_item_uid: "${uid}"
      }) {
        cart {
          ${await getEmailField()}

          ${await getIsVirtual()}

          ${await getItems()}

          ${await getPaymentMethods()}

          ${await getPrices()}

          ${await getShippingAddresses()}
        }
      }
    }`;
  return graphQlRequest(request, {}, {}, 'BetterCheckoutCartRemove')
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.removeItemFromCart.cart;
    });
};
