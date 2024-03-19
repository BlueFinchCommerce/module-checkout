import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import getDummyPaymentMethods from '@/helpers/dummyContent/getDummyPaymentMethods';

function transformGraphqlExtraDetails(paymentMethodsExtraDetails) {
  const transformedData = paymentMethodsExtraDetails?.map((item) => ({
    [item.type]: {
      icon: item.icon,
      isOpenInvoice: item.isOpenInvoice,
      configuration: item.configuration,
    },
  })) || [];

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

  // Uses dummy data for designer UI rather than graphQL request
  return Promise.resolve({
    paymentMethodsExtraDetails:
      transformGraphqlExtraDetails(getDummyPaymentMethods.adyenPaymentMethods.paymentMethodsExtraDetails),
    paymentMethodsResponse: getDummyPaymentMethods.adyenPaymentMethods.paymentMethodsResponse || {
      paymentMethods: [],
    },
  });
};
