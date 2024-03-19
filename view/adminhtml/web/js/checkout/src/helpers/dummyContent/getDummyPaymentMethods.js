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
          id: 'F8XKZJVLM7ZXWST5',
          brand: 'mc',
          expiryMonth: '03',
          expiryYear: '30',
          holderName: 'Checkout Shopper PlaceHolder',
          lastFour: '5454',
          name: 'MasterCard',
          ownerName: null,
          networkTxReference: 'OYUPQPZ6H03130313',
          type: 'scheme',
          supportedShopperInteractions: [
            'Ecommerce',
            'ContAuth',
          ],
        },
        {
          id: 'DJDBSGSKM7ZXWST5',
          brand: 'mc',
          expiryMonth: '03',
          expiryYear: '30',
          holderName: 'Checkout Shopper PlaceHolder',
          lastFour: '1111',
          name: 'MasterCard',
          ownerName: null,
          networkTxReference: '9VZSUN36Q03130313',
          type: 'scheme',
          supportedShopperInteractions: [
            'Ecommerce',
            'ContAuth',
          ],
        },
        {
          id: 'TZW5N8L643M84H82',
          brand: 'visa',
          expiryMonth: '03',
          expiryYear: '30',
          holderName: 'Checkout Shopper PlaceHolder',
          lastFour: '1111',
          name: 'VISA',
          ownerName: null,
          networkTxReference: '578106576048182',
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
