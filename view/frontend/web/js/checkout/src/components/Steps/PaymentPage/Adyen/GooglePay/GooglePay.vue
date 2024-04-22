<template>
  <div
    v-if="isAdyenAvailable"
    id="adyen-google-pay"
    :class="!googlePayLoaded ? 'text-loading' : ''"
  />
  <div
    v-if="isAdyenAvailable"
    v-show="threeDSVisible"
    id="adyen-threeds-container"
  />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import AdyenCheckout from '@adyen/adyen-web';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useLoadingStore from '@/stores/LoadingStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import '@adyen/adyen-web/dist/adyen.css';

import formatPrice from '@/helpers/payment/formatPrice';
import getAdyenProductionMode from '@/helpers/payment/getAdyenProductionMode';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import expressPaymentOnClickDataLayer from '@/helpers/dataLayer/expressPaymentOnClickDataLayer';

import createPayment from '@/services/payments/createPaymentGraphQl';
import getAdyenPaymentStatus from '@/services/adyen/getAdyenPaymentStatus';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

export default {
  name: 'AdyenGooglePay',
  data() {
    return {
      browserInfo: {},
      googlePayLoaded: false,
      googlePayNoShippingMethods: '',
      key: 'adyenGooglePay',
      orderId: null,
      threeDSVisible: false,
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
    this.addExpressMethod(this.key);

    await this.getInitialConfig();
    await this.getCart();

    // Early return is Adyen isn't available.
    if (!this.isAdyenAvailable) {
      this.googlePayLoaded = true;
      this.removeExpressMethod(this.key);
      return;
    }

    const paymentMethodsResponse = await this.getPaymentMethodsResponse();
    const googlePayMethod = this.getGooglePayMethod(paymentMethodsResponse);
    if (!googlePayMethod) {
      // Return early if Google Pay isn't enabled in Adyen.
      this.googlePayLoaded = true;
      this.removeExpressMethod(this.key);
      return;
    }
    const googlePayConfig = paymentMethodsResponse.paymentMethods.find((method) => (
      method.type === 'paywithgoogle' || method.type === 'googlepay'
    ));

    // Early return is Google Pay isn't available.
    if (!googlePayConfig) {
      this.removeExpressMethod(this.key);
      this.googlePayLoaded = true;
      return;
    }

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
        this.googlePayLoaded = true;
      })
      .catch(() => {
        this.removeExpressMethod(this.key);
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
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useShippingMethodsStore, ['submitShippingInfo']),
    ...mapActions(useAdyenStore, [
      'getIsAdyenAvailable',
      'getPaymentMethodsResponse',
    ]),
    ...mapActions(usePaymentStore, [
      'addExpressMethod',
      'removeExpressMethod',
      'setErrorMessage',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, ['submitEmail']),
    ...mapActions(useLoadingStore, ['setLoadingState']),
    ...mapActions(useRecaptchaStore, ['validateToken']),

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

        this.setLoadingState(true);
        const response = await getAdyenPaymentStatus(this.orderId);

        this.handleAdyenResponse(response);
      } catch (error) {
        // If the getAdyenPaymentDetails call errors we need to catch it.
        this.setLoadingState(false);
        const message = error.response?.data?.message;
        this.setErrorMessage(message);
      }
    },

    getGooglePayConfiguration(googlePayConfig) {
      const callbackIntents = ['PAYMENT_AUTHORIZATION'];

      if (!this.cart.is_virtual) {
        callbackIntents.push('SHIPPING_ADDRESS', 'SHIPPING_OPTION');
      }

      return {
        amount: {
          value: this.cartGrandTotal,
          currency: this.currencyCode,
        },
        countryCode: this.countryCode,
        environment: getAdyenProductionMode() ? 'LIVE' : 'TEST',
        paymentDataCallbacks: {
          onPaymentAuthorized: this.onPaymentAuthorized,
          ...(this.cart.is_virtual ? {} : { onPaymentDataChanged: this.onPaymentDataChanged }),
        },
        emailRequired: true,
        shippingAddressRequired: !this.cart.is_virtual,
        shippingAddressParameters: {
          phoneNumberRequired: !this.cart.is_virtual,
        },
        billingAddressRequired: true,
        billingAddressParameters: {
          format: 'FULL',
          phoneNumberRequired: true,
        },
        shippingOptionRequired: !this.cart.is_virtual,
        callbackIntents,
        configuration: {
          gatewayMerchantId: googlePayConfig.configuration.gatewayMerchantId,
          merchantId: googlePayConfig.configuration.merchantId,
        },
        onAuthorized: this.handeOnAuthorized,
        onClick: (resolve, reject) => this.onClick(resolve, reject, googlePayConfig.type),
        onSubmit: () => {},
      };
    },

    onClick(resolve, reject, type) {
      this.setErrorMessage('');
      // Check that the agreements (if any) and recpatcha is valid.
      const agreementsValid = this.validateAgreements();
      const recaptchaValid = this.validateToken('placeOrder');

      if (!agreementsValid || !recaptchaValid) {
        return false;
      }

      expressPaymentOnClickDataLayer(type);

      return resolve();
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
        if (!this.cart.is_virtual && !this.cart.shipping_addresses[0].selected_shipping_method) {
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
        const { phoneNumber: billingPhoneNumber } = billingAddress;
        const mapBillingAddress = this.mapAddress(billingAddress, email, billingPhoneNumber);

        let mapShippingAddress = null;

        if (!this.cart.is_virtual) {
          const { shippingAddress } = data;
          const { phoneNumber: shippingPhoneNumber } = shippingAddress;
          mapShippingAddress = this.mapAddress(shippingAddress, email, shippingPhoneNumber);
        }

        setAddressesOnCart(mapShippingAddress, mapBillingAddress, email)
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
            return paymentMethod;
          })
          .then(createPayment)
          .then((orderNumber) => {
            this.setOrderId(orderNumber);
            resolve({
              transactionState: 'SUCCESS',
            });
          })
          .catch((error) => {
            resolve({
              error: {
                reason: 'PAYMENT_DATA_INVALID',
                message: error.message,
                intent: 'PAYMENT_AUTHORIZATION',
              },
            });
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
          this.setLoadingState(false);
          this.setErrorMessage(response.message);
        }
      } else if (response.action) {
        this.setErrorMessage(response.message);

        // If the action is 3DS related then add a class globally so we can display as popup.
        if (response.action.type === 'threeDS2') {
          document.body.classList.add('gene-checkout-threeds-opened');
        }

        const threeDSConfiguration = {
          challengeWindowSize: '05',
        };

        this.threeDSVisible = true;
        this.checkout.createFromAction(response.action, threeDSConfiguration).mount('#adyen-threeds-container');
      }
    },

    mapAddress(address, email, telephone) {
      const [firstname, ...lastname] = address.name.split(' ');
      const regionId = this.getRegionId(address.countryCode, address.administrativeArea);
      return {
        street: [
          address.address1,
          address.address2,
        ],
        company: address.company || '',
        postcode: address.postalCode,
        country_code: address.countryCode,
        email,
        firstname,
        lastname: lastname.length ? lastname.join(' ') : 'UNKNOWN',
        city: address.locality,
        telephone,
        region: {
          ...(address.administrativeArea ? { region: address.administrativeArea } : {}),
          ...(regionId ? { region_id: regionId } : {}),
        },
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
