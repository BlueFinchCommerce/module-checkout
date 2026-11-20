import useCartStore from '@/stores/CartStore';
import graphQlRequest from '@/services/graphQlRequest';

import getAppliedStoreCredit from '@/helpers/cart/queryData/getAppliedStoreCredit';
import getGiftCards from '@/helpers/cart/queryData/getGiftCards';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
import getEmailField from '@/helpers/cart/queryData/getEmailField';
import getMagentoSolutionType from '@/helpers/getMagentoSolutionType';

import functionExtension from '@/extensions/functionExtension';

export default async (carrierCode, methodCode) => {
  const { maskedId } = useCartStore();
  let commerceFields = '';

  if (getMagentoSolutionType()) {
    commerceFields = `
      ${await getGiftCards()}
      ${await getAppliedStoreCredit()}
    `;
  }

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

          ${commerceFields}

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

      return functionExtension('setShippingMethods', [
        response.data.setShippingMethodsOnCart.cart,
        carrierCode,
        methodCode,
      ]);
    })
    .then(([cart]) => cart);
};
