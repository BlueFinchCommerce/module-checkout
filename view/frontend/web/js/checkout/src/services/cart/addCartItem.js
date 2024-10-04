import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getIsVirtual from '@/helpers/cart/queryData/getIsVirtual';
import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';

export default async (product) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      addSimpleProductsToCart(input: {
        cart_id: "${maskedId}"
        cart_items: [
          {
            data: {
              sku: "${product.sku}"
              quantity: "1"
              selected_options: []
              entered_options: []
            }
          }
        ]
      }) {
        cart {
          ${await getIsVirtual()}

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

      return response.data.addSimpleProductsToCart.cart;
    });
};
