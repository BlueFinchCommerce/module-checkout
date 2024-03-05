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
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';
import handleServiceError from '@/helpers/handleServiceError';
import expressPaymentOnClick from '@/helpers/expressPaymentOnClick';

import createPayment from '@/services/createPayment';
import getAdyenPaymentStatus from '@/services/getAdyenPaymentStatus';
import getShippingMethods from '@/services/getShippingMethods';
import refreshCustomerData from '@/services/refreshCustomerData';

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
    ...mapState(useCartStore, ['cartGrandTotal']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
    ...mapState(useConfigStore, [
      'currencyCode',
      'locale',
      'countryCode',
      'stateRequired',
      'countries',
    ]),
    ...mapState(usePaymentStore, ['availableMethods']),
  },
  async created() {
    await this.getStoreConfig();

    await this.getIsAdyenAvailable();

    // Early return is Adyen isn't available.
    if (!this.isAdyenAvailable) {
      this.googlePayLoaded = true;
      return;
    }

    await this.getAdyenConfig();
    await this.getCartData();
    await this.getCart();
    await this.getCartTotals();
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
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'getCartTotals']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['setEmailAddress', 'setAddress']),

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
        ShippingAddressParameters: {
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
        onClick: (resolve, reject) => expressPaymentOnClick(resolve, reject, googlePayConfig.type),
        onSubmit: () => {},
      };
    },

    onPaymentDataChanged(data) {
      return new Promise((resolve) => {
        const address = {
          country_id: data.shippingAddress.countryCode,
          postcode: data.shippingAddress.postalCode,
          street: [''],
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

          this.selectShippingMethod(selectedShipping);

          // Set the billing address to the same as shipping for now. Magento doesn't use this
          // yet and it is replaced with the correct billing in the onAuthorized.
          this.setAddress(address, 'shipping');
          this.setAddress(address, 'billing');
          const totals = await this.submitShippingInfo();
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
                  price: totals.shipping_incl_tax.toString(),
                  status: 'FINAL',
                },
              ],
              currencyCode: totals.quote_currency_code,
              totalPriceStatus: 'FINAL',
              totalPrice: totals.base_grand_total.toString(),
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
        if (!this.selectedMethod.carrier_code) {
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
        const mapShippingAddress = this.mapAddress(data.shippingAddress, email, phoneNumber);
        const mapBillingAddress = this.mapAddress(billingAddress, email, phoneNumber);
        const extensionAttributes = getPaymentExtensionAttributes();

        this.setEmailAddress(email);
        this.setAddress(mapShippingAddress, 'shipping');
        this.setAddress(mapBillingAddress, 'billing');

        this.submitShippingInfo().then(async () => {
          const stateData = JSON.stringify({
            paymentMethod: {
              googlePayCardNetwork: data.paymentMethodData.info.cardNetwork,
              googlePayToken: data.paymentMethodData.tokenizationData.token,
              type: 'googlepay',
            },
            browserInfo: this.browserInfo,
          });
          const payload = {
            email: data.email,
            shippingAddress: mapShippingAddress,
            billingAddress: mapBillingAddress,
            paymentMethod: {
              method: 'adyen_hpp',
              additional_data: {
                brand_code: 'googlepay',
                stateData,
              },
              extension_attributes: extensionAttributes,
            },
          };

          try {
            const orderId = await createPayment(payload).catch(handleServiceError);

            this.setOrderId(orderId);

            resolve({
              transactionState: 'SUCCESS',
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
      const statesRequired = this.stateRequired;
      let region;
      if (statesRequired.indexOf(address.countryCode) !== -1) {
        const country = this.countries.find((cty) => cty.id === address.countryCode);
        if (country.available_regions && country.available_regions.length) {
          region = country.available_regions.find((rgin) => rgin.name === address.administrativeArea);
        }
      }
      const [firstname, ...lastname] = address.name.split(' ');
      return {
        street: [
          address.address1,
          address.address2,
          address.address3,
        ],
        postcode: address.postalCode,
        country_id: address.countryCode,
        email,
        firstname,
        lastname: lastname.length ? lastname.join(' ') : 'UNKNOWN',
        city: address.locality,
        telephone,
        region: address.administrativeArea,
        region_id: region ? region.id : 0,
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
