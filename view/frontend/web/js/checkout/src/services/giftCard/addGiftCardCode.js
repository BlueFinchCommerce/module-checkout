import graphQlRequest from '@/services/graphQlRequest';
import useCartStore from '@/stores/CartStore';

import getGiftCards from '@/helpers/cart/queryData/getGiftCards';
import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
import getEmailField from '@/helpers/cart/queryData/getEmailField';

export default async (code) => {
  const { maskedId } = useCartStore();
  const request = `
    mutation {
      applyGiftCardToCart(input: {
        cart_id: "${maskedId}"
        gift_card_code: "${code}"
      }) {
        cart {
          ${await getEmailField()}

          ${await getGiftCards()}

          ${await getItems()}

          ${await getPaymentMethods()}

          ${await getPrices()}

          ${await getShippingAddresses()}
        }
      }
    }`;
  return graphQlRequest(request, {}, {}, 'BetterCheckoutCart')
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.applyGiftCardToCart.cart;
    });
};
