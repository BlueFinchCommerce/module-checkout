import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import graphQlRequest from '@/services/graphQlRequest';

function transformGraphqlExtraDetails(paymentMethodsExtraDetails) {
  const transformedData = paymentMethodsExtraDetails.map((item) => ({
    [item.type]: {
      icon: item.icon,
      isOpenInvoice: item.isOpenInvoice,
      configuration: item.configuration,
    },
  }));

  return Object.assign({}, ...transformedData);
}

export default async () => {
  const { maskedId } = useCartStore();
  const { storeCode } = useConfigStore();

  let cartId;
  if (!maskedId) {
    cartId = await getMaskedIdFromGraphQl();
  } else {
    cartId = maskedId;
  }

  const request = ` {
    adyenPaymentMethods(cart_id: "${cartId}", shopper_locale: "${storeCode}") {
        paymentMethodsExtraDetails {
            type
            icon {
                url
                width
                height
            }
            isOpenInvoice
            configuration {
                amount {
                    value
                    currency
                }
                currency
            }
        }
        paymentMethodsResponse {
            paymentMethods {
                name
                type
                brand
                brands
                configuration {
                    merchantId
                    merchantName
                    gatewayMerchantId
                }
                details {
                    key
                    type
                    items {
                        id
                        name
                    }
                    optional
                }
            }
            storedPaymentMethods {
              id
              brand
              expiryMonth
              expiryYear
              holderName
              lastFour
              name
              ownerName
              networkTxReference
              type
              supportedShopperInteractions
            }
        }
    }
}`;

  return graphQlRequest(request)
    .then((response) => ({
      paymentMethodsExtraDetails:
        transformGraphqlExtraDetails(response.data.adyenPaymentMethods.paymentMethodsExtraDetails),
      paymentMethodsResponse: response.data.adyenPaymentMethods.paymentMethodsResponse,
    }));
};
