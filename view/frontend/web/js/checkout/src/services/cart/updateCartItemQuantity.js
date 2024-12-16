import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
import getEmailField from '@/helpers/cart/queryData/getEmailField';

export default async (item, change) => {
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
          ${await getEmailField()}

          ${await getItems()}

          ${await getPaymentMethods()}

          ${await getPrices()}

          ${await getShippingAddresses()}
        }
      }
    }`;
  return graphQlRequest(request, {}, {}, 'BetterCheckoutCartUpdate')
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.updateCartItems.cart;
    });
};
