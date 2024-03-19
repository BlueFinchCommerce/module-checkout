export default {
  adyenPaymentMethods: {
    paymentMethodsExtraDetails: [
      {
        type: 'card',
        icon: {
          url: `https://checkout-admin.test/static/version1710849905/frontend/Magento/luma/en_US/
                Adyen_Payment/images/logos/card.png`,
          width: 77,
          height: 50,
        },
        isOpenInvoice: false,
        configuration: null,
      },
      {
        type: 'applepay',
        icon: {
          url: 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/applepay.svg',
          width: 77,
          height: 50,
        },
        isOpenInvoice: false,
        configuration: {
          amount: {
            value: 33560,
            currency: 'USD',
          },
          currency: 'USD',
        },
      },
      {
        type: 'googlepay',
        icon: {
          url: 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/googlepay.svg',
          width: 77,
          height: 50,
        },
        isOpenInvoice: false,
        configuration: {
          amount: {
            value: 33560,
            currency: 'USD',
          },
          currency: 'USD',
        },
      },
      {
        type: 'scheme',
        icon: null,
        isOpenInvoice: null,
        configuration: {
          amount: {
            value: 33560,
            currency: 'USD',
          },
          currency: 'USD',
        },
      },
    ],
    paymentMethodsResponse: {
      paymentMethods: [
        {
          name: 'Credit Card',
          type: 'scheme',
          brand: null,
          brands: ['visa', 'mc', 'amex'],
          configuration: null,
          details: null,
        },
        {
          name: 'Apple Pay',
          type: 'applepay',
          brand: null,
          brands: ['visa', 'mc', 'amex'],
          configuration: {
            merchantId: '000000000204622',
            merchantName: 'PluginPartnerTestingECOM',
            gatewayMerchantId: null,
          },
          details: null,
        },
        {
          name: 'Google Pay',
          type: 'googlepay',
          brand: null,
          brands: null,
          configuration: {
            merchantId: '50',
            merchantName: null,
            gatewayMerchantId: 'PluginPartnerTestingECOM',
          },
          details: null,
        },
      ],
      storedPaymentMethods: [
        {
          id: ' ',
          brand: 'mc',
          expiryMonth: 'CA',
          expiryYear: 'RD',
          holderName: 'Checkout Shopper PlaceHolder',
          lastFour: 'TEST',
          name: 'MasterCard',
          ownerName: null,
          networkTxReference: ' ',
          type: 'scheme',
          supportedShopperInteractions: [
            'Ecommerce',
            'ContAuth',
          ],
        },
        {
          id: ' ',
          brand: 'mc',
          expiryMonth: 'CA',
          expiryYear: 'RD',
          holderName: 'Checkout Shopper PlaceHolder',
          lastFour: 'TEST',
          name: 'MasterCard',
          ownerName: null,
          networkTxReference: ' ',
          type: 'scheme',
          supportedShopperInteractions: [
            'Ecommerce',
            'ContAuth',
          ],
        },
        {
          id: ' ',
          brand: 'visa',
          expiryMonth: 'CA',
          expiryYear: 'RD',
          holderName: 'Checkout Shopper PlaceHolder',
          lastFour: 'TEST',
          name: 'VISA',
          ownerName: null,
          networkTxReference: ' ',
          type: 'scheme',
          supportedShopperInteractions: [
            'Ecommerce',
            'ContAuth',
          ],
        },
      ],
    },
  },
};
