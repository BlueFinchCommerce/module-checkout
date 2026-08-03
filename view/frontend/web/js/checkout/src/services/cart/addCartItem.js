import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getIsVirtual from '@/helpers/cart/queryData/getIsVirtual';
import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
import getEmailField from '@/helpers/cart/queryData/getEmailField';

export default async (product) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation BlueFinchCheckoutCartAdd($cartId: String!, $cartItems: [CartItemInput!]!) {
      addProductsToCart(
        cartId: $cartId
        cartItems: $cartItems
      ) {
        cart {
          ${await getEmailField()}

          ${await getIsVirtual()}

          ${await getItems()}

          ${await getPaymentMethods()}

          ${await getPrices()}

          ${await getShippingAddresses()}
        }
        user_errors {
          code
          message
        }
      }
    }`;
  const cartItem = {
    sku: product.sku,
    quantity: product.quantity || 1,
    selected_options: [],
    entered_options: [],
  };
  if (product.parent_sku) {
    cartItem.parent_sku = product.parent_sku;
  }

  return graphQlRequest(request, {
    cartId: maskedId,
    cartItems: [cartItem],
  }, {}, 'BlueFinchCheckoutCartAdd')
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }
      const userErrors = response.data.addProductsToCart.user_errors;
      if (userErrors.length) {
        throw new Error(userErrors[0].message);
      }

      return response.data.addProductsToCart.cart;
    });
};
