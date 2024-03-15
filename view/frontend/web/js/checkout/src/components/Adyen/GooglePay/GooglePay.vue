<template>
  <Loader v-if="loading" />
  <div
    id="adyen-google-pay"
    :class="!googlePayLoaded ? 'text-loading' : ''"
  />
  <div id="adyen-threeds-container" />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/AdyenStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

import Loader from '@/components/Core/Loader/Loader.vue';

import formatPrice from '@/helpers/formatPrice';
import getAdyenProductionMode from '@/helpers/getAdyenProductionMode';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';
import expressPaymentOnClickDataLayer from '@/helpers/dataLayer/expressPaymentOnClickDataLayer';

import createPayment from '@/services/createPayment';
import getAdyenPaymentStatus from '@/services/adyen/getAdyenPaymentStatus';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/refreshCustomerData';
import setBillingAddressOnCart from '@/services/addresses/setBillingAddressOnCart';

export default {
  name: 'AdyenGooglePay',
  components: {
    Loader,
  },
  data() {
    return {
      browserInfo: {},
      googlePayNoShippingMethods: '',
      orderId: null,
      loading: false,
      googlePayLoaded: false,
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['isAdyenAvailable']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
    ...mapState(useConfigStore, [
      'currencyCode',
      'storeCode',
      'locale',
      'countryCode',
      'countries',
      'getRegionId',
    ]),
    ...mapState(usePaymentStore, ['availableMethods']),
  },
  async created() {
    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCart();
    }

    await this.getIsAdyenAvailable();

    // Early return is Adyen isn't available.
    if (!this.isAdyenAvailable) {
      this.googlePayLoaded = true;
      return;
    }

    await this.getAdyenConfig();
    const paymentMethodsResponse = await this.getPaymentMethodsResponse();
    const googlePayMethod = this.getGooglePayMethod(paymentMethodsResponse);
    if (!googlePayMethod) {
      this.googlePayLoaded = true;
      // Return early if Google Pay isn't enabled in Adyen.
      return;
    }
    const googlePayConfig = paymentMethodsResponse.paymentMethods.find((method) => (
      method.type === 'paywithgoogle' || method.type === 'googlepay'
    ));

    const googlePayConfiguration = this.getGooglePayConfiguration(googlePayConfig);
    const configuration = {
      paymentMethodsResponse,
      locale: this.locale,
      environment: getAdyenProductionMode() ? 'LIVE' : 'TEST',
      analytics: {
        enabled: false,
      },
    };
    this.checkout = await AdyenCheckout(configuration);
    const googlePayComponent = this.checkout.create('googlepay', googlePayConfiguration);

    googlePayComponent
      .isAvailable()
      .then(() => {
        googlePayComponent.mount('#adyen-google-pay');
        this.expressPaymentsLoad();
      })
      .catch(() => {
        console.warn('Google Pay is not available');
      });

    this.browserInfo = googlePayComponent.browserInfo;
    // Add transation at this point otherwise `$t` is undefined in callbacks.
    this.googlePayNoShippingMethods = this.$t('errorMessages.googlePayNoShippingMethods');
  },
  mounted() {
    const googlePayScript = document.createElement('script');
    googlePayScript.setAttribute('src', 'https://pay.google.com/gp/p/js/pay.js');
    document.head.appendChild(googlePayScript);
  },
  methods: {
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'submitShippingInfo']),
    ...mapActions(useAdyenStore, [
      'getAdyenConfig',
      'getIsAdyenAvailable',
      'getPaymentMethodsResponse',
    ]),
    ...mapActions(usePaymentStore, [
      'getPaymentMethods',
      'setErrorMessage',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['submitEmail', 'setAddressToStore']),

    expressPaymentsLoad() {
      this.$emit('expressPaymentsLoad', 'true');
      this.googlePayLoaded = true;
    },

    setOrderId(orderId) {
      this.orderId = orderId;
      return orderId;
    },

    getGooglePayMethod(paymentMethodsResponse) {
      return paymentMethodsResponse.paymentMethods.find(({ type }) => (
        type === 'paywithgoogle' || 'googlepay'
      ));
    },

    async handeOnAuthorized() {
      try {
        document.body.classList.remove('gene-checkout-threeds-opened');

        this.loading = true;
        const response = await getAdyenPaymentStatus(this.orderId);
        this.loading = false;

        this.handleAdyenResponse(response);
      } catch (error) {
        // If the getAdyenPaymentDetails call errors we need to catch it.
        const message = error.response?.data?.message;
        this.setErrorMessage(message);
      }
    },

    getGooglePayConfiguration(googlePayConfig) {
      return {
        amount: {
          value: this.cartGrandTotal,
          currency: this.currencyCode,
        },
        countryCode: this.countryCode,
        environment: getAdyenProductionMode() ? 'LIVE' : 'TEST',
        paymentDataCallbacks: {
          onPaymentDataChanged: this.onPaymentDataChanged,
          onPaymentAuthorized: this.onPaymentAuthorized,
        },
        emailRequired: true,
        shippingAddressRequired: true,
        shippingAddressParameters: {
          phoneNumberRequired: true,
        },
        billingAddressRequired: true,
        billingAddressParameters: {
          format: 'FULL',
          phoneNumberRequired: true,
        },
        shippingOptionRequired: true,
        callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION', 'PAYMENT_AUTHORIZATION'],
        configuration: {
          gatewayMerchantId: googlePayConfig.configuration.gatewayMerchantId,
          merchantId: googlePayConfig.configuration.merchantId,
        },
        onAuthorized: this.handeOnAuthorized,
        onClick: (resolve, reject) => expressPaymentOnClickDataLayer(resolve, reject, googlePayConfig.type),
        onSubmit: () => {},
      };
    },

    onPaymentDataChanged(data) {
      return new Promise((resolve) => {
        const address = {
          country_code: data.shippingAddress.countryCode,
          postcode: data.shippingAddress.postalCode,
          region: data.shippingAddress.administrativeArea,
          region_id: this.getRegionId(data.shippingAddress.countryCode, data.shippingAddress.administrativeArea),
          street: ['0'],
        };

        getShippingMethods(address).then(async (response) => {
          const shippingMethods = response.map((shippingMethod) => {
            const description = shippingMethod.carrier_title
              ? `${formatPrice(shippingMethod.price_incl_tax.value)} ${shippingMethod.carrier_title}`
              : formatPrice(shippingMethod.price_incl_tax.value);

            return {
              id: shippingMethod.method_code,
              label: shippingMethod.method_title,
              description,
            };
          });

          // Filter out nominated day as this isn't available inside of Google Pay.
          const fShippingMethods = shippingMethods.filter((sid) => sid.id !== 'nominated_delivery');

          // Any error message means we need to exit by resolving with an error state.
          if (!fShippingMethods.length) {
            resolve({
              error: {
                reason: 'SHIPPING_ADDRESS_UNSERVICEABLE',
                message: this.googlePayNoShippingMethods,
                intent: 'SHIPPING_ADDRESS',
              },
            });
            return;
          }

          const selectedShipping = data.shippingOptionData.id === 'shipping_option_unselected'
            ? response[0]
            : response.find(({ method_code: id }) => id === data.shippingOptionData.id) || response[0];

          await this.submitShippingInfo(selectedShipping.carrier_code, selectedShipping.method_code);
          const paymentDataRequestUpdate = {
            newShippingOptionParameters: {
              defaultSelectedOptionId: selectedShipping.method_code,
              shippingOptions: fShippingMethods,
            },
            newTransactionInfo: {
              displayItems: [
                {
                  label: 'Shipping',
                  type: 'LINE_ITEM',
                  price: this.cart.shipping_addresses[0].selected_shipping_method.amount.value.toString(),
                  status: 'FINAL',
                },
              ],
              currencyCode: this.cart.prices.grand_total.currency,
              totalPriceStatus: 'FINAL',
              totalPrice: this.cart.prices.grand_total.value.toString(),
              totalPriceLabel: 'Total',
              countryCode: this.countryCode,
            },
          };
          resolve(paymentDataRequestUpdate);
        });
      });
    },

    onPaymentAuthorized(data) {
      return new Promise((resolve) => {
        // If there is no select shipping method at this point display an error.
        if (!this.cart.shipping_addresses[0].selected_shipping_method) {
          resolve({
            error: {
              reason: 'SHIPPING_OPTION_INVALID',
              message: 'No shipping method selected',
              intent: 'SHIPPING_OPTION',
            },
          });
          return;
        }

        const { email } = data;
        const { billingAddress } = data.paymentMethodData.info;
        const { phoneNumber } = billingAddress;
        const mapBillingAddress = this.mapAddress(billingAddress, email, phoneNumber);

        try {
          this.submitEmail(email)
            .then(() => setBillingAddressOnCart(mapBillingAddress))
            .then(() => {
              const stateData = JSON.stringify({
                paymentMethod: {
                  googlePayCardNetwork: data.paymentMethodData.info.cardNetwork,
                  googlePayToken: data.paymentMethodData.tokenizationData.token,
                  type: 'googlepay',
                },
                browserInfo: this.browserInfo,
              });

              const paymentMethod = {
                code: 'adyen_hpp',
                adyen_additional_data_hpp: {
                  brand_code: 'googlepay',
                  stateData,
                },
              };

              createPayment(paymentMethod)
                .then((orderNumber) => {
                  this.setOrderId(orderNumber);
                  resolve({
                    transactionState: 'SUCCESS',
                  });
                });
            });
        } catch (error) {
          resolve({
            error: {
              reason: 'PAYMENT_DATA_INVALID',
              message: error.message,
              intent: 'PAYMENT_AUTHORIZATION',
            },
          });
        }
      });
    },

    async handleAdyenResponse(response) {
      if (response.isFinal) {
        const approvedCodes = [
          'Authorised',
          'Received',
          'PresentToShopper',
        ];
        if (approvedCodes.includes(response.resultCode)) {
          await refreshCustomerData(getCartSectionNames());
          window.location.href = getSuccessPageUrl();
        } else {
          this.setErrorMessage(response.message);
        }
      } else if (response.action) {
        // If the action is 3DS related then add a class globally so we can display as popup.
        if (response.action.type === 'threeDS2') {
          document.body.classList.add('gene-checkout-threeds-opened');
        }

        const threeDSConfiguration = {
          challengeWindowSize: '05',
        };

        this.checkout.createFromAction(response.action, threeDSConfiguration).mount('#adyen-threeds-container');
      }
    },

    mapAddress(address, email, telephone) {
      const [firstname, ...lastname] = address.name.split(' ');
      return {
        street: [
          address.address1,
          address.address2,
        ],
        postcode: address.postalCode,
        country_code: address.countryCode,
        email,
        firstname,
        lastname: lastname.length ? lastname.join(' ') : 'UNKNOWN',
        city: address.locality,
        telephone,
        region: address.administrativeArea,
        region_id: this.getRegionId(address.countryCode, address.administrativeArea),
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
