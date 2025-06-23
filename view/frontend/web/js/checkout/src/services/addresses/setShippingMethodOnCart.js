import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';

import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
import getEmailField from '@/helpers/cart/queryData/getEmailField';

export default async (carrierCode, methodCode) => {
  const { maskedId } = useCartStore();

  const request = `
    mutation {
      setShippingMethodsOnCart(
        input: {
          cart_id: "${maskedId}"
          shipping_methods: [
            {
              carrier_code: "${carrierCode}"
              method_code: "${methodCode}"
            }
          ]
        }
      ) {
        cart {
          ${await getEmailField()}

          ${await getPaymentMethods()}

          ${await getPrices()}

          ${await getShippingAddresses()}
        }
      }
    }`;

  return graphQlRequest(request, {}, {}, 'BlueFinchCheckoutSetShippingMethodCart')
    .then((response) => {
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return response.data.setShippingMethodsOnCart.cart;
    });
};
