<template>
  <div
    id="braintree-google-pay"
    ref="braintreeGooglePay"
    :class="!googlePayLoaded ? 'text-loading' : ''"
  />
  <div id="braintree-threeds-container" />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { markRaw } from 'vue';

import braintree from 'braintree-web';

import useBraintreeStore from '@/stores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import formatPrice from '@/helpers/formatPrice';
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';
import handleServiceError from '@/helpers/handleServiceError';

import createPayment from '@/services/createPayment';
import getShippingMethods from '@/services/getShippingMethods';
import refreshCustomerData from '@/services/refreshCustomerData';

export default {
  name: 'BraintreeGooglePay',
  data() {
    return {
      googlePayNoShippingMethods: '',
      instance: null,
      googleClient: null,
      googlePaymentInstance: null,
      googlePayLoaded: false,
    };
  },
  computed: {
    ...mapState(useBraintreeStore, ['environment', 'clientToken', 'google']),
    ...mapState(useCartStore, ['cartGrandTotal']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
    ...mapState(useConfigStore, [
      'currencyCode',
      'locale',
      'countryCode',
      'countries',
      'getRegionId',
    ]),
    ...mapState(usePaymentStore, ['availableMethods']),
  },
  async created() {
    await this.getStoreConfig();
    await this.getBraintreeConfig();
    await this.getCartData();
    await this.getCart();
    await this.getCartTotals();
    await this.getPaymentMethods();

    const googlePayConfig = this.availableMethods.find((method) => (
      method.code === 'braintree_googlepay'
    ));

    if (!googlePayConfig) {
      this.googlePayLoaded = true;
      return; // Early return if Braintree Google Pay isn't enabled.
    }

    await this.createClientToken();

    this.googleClient = markRaw(new window.google.payments.api.PaymentsClient({
      environment: this.environment === 'sandbox' ? 'TEST' : 'LIVE',
      paymentDataCallbacks: {
        onPaymentDataChanged: this.onPaymentDataChanged,
        onPaymentAuthorized: this.onPaymentAuthorized,
      },
    }));

    this.instance = await markRaw(braintree.client.create({
      authorization: this.clientToken,
    }));

    braintree.googlePayment.create({
      client: this.instance,
      googlePayVersion: 2,
    }, (error, googlePaymentInstance) => {
      this.googlePaymentInstance = markRaw(googlePaymentInstance);

      this.googleClient
        .isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: googlePaymentInstance.createPaymentDataRequest().allowedPaymentMethods,
          existingPaymentMethodRequired: true,
        }).then((isReadyToPay) => {
          if (isReadyToPay) {
            const button = this.googleClient.createButton({
              buttonColor: this.google.buttonColor,
              buttonType: 'buy',
              buttonSizeMode: 'fill',
              onClick: () => this.onClick(),
            });
            this.$refs.braintreeGooglePay.append(button);
            this.expressPaymentsLoad();
          }
        });
    });
  },
  mounted() {
    const googlePayScript = document.createElement('script');
    googlePayScript.setAttribute('src', 'https://pay.google.com/gp/p/js/pay.js');
    document.head.appendChild(googlePayScript);
  },
  methods: {
    ...mapActions(useBraintreeStore, ['getBraintreeConfig', 'createClientToken']),
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'submitShippingInfo']),
    ...mapActions(usePaymentStore, ['getPaymentMethods', 'setErrorMessage']),
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'getCartTotals']),
    ...mapActions(useConfigStore, ['getStoreConfig', 'getAdyenConfig']),
    ...mapActions(useCustomerStore, ['setEmailAddress', 'setAddress']),

    expressPaymentsLoad() {
      this.$emit('expressPaymentsLoad', 'true');
      this.googlePayLoaded = true;
    },

    onClick() {
      const paymentDataRequest = this.googlePaymentInstance.createPaymentDataRequest({
        transactionInfo: {
          countryCode: this.countryCode,
          currencyCode: this.currencyCode,
          totalPriceStatus: 'FINAL',
          totalPrice: (this.cartGrandTotal / 100).toString(),
        },
        emailRequired: true,
        shippingAddressRequired: true,
        shippingAddressParameters: {
          phoneNumberRequired: true,
        },
        shippingOptionRequired: true,
        callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION', 'PAYMENT_AUTHORIZATION'],
      });

      const cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
      cardPaymentMethod.parameters.billingAddressRequired = true;
      cardPaymentMethod.parameters.billingAddressParameters = {
        format: 'FULL',
        phoneNumberRequired: true,
      };

      return this.googleClient.loadPaymentData(paymentDataRequest)
        .then(this.handleThreeDs)
        .then(this.makePayment)
        .then(() => refreshCustomerData(['cart']))
        .then(() => { window.location.href = getSuccessPageUrl(); })
        .catch((err) => {
          if (err.message) {
            this.setErrorMessage(err.message);
          }
        });
    },

    getGooglePayMethod(paymentMethodsResponse) {
      return paymentMethodsResponse.paymentMethods.find(({ type }) => (
        type === 'paywithgoogle' || 'googlepay'
      ));
    },

    onPaymentDataChanged(data) {
      return new Promise((resolve) => {
        const address = {
          country_id: data.shippingAddress.countryCode,
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
                message: this.$t('errorMessages.googlePayNoShippingMethods'),
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

        const { androidPayCards } = JSON.parse(data.paymentMethodData.tokenizationData.token);

        if (!androidPayCards?.[0]?.nonce || !androidPayCards?.[0]?.details?.bin) {
          resolve({
            error: {
              reason: 'SHIPPING_OPTION_INVALID',
              message: 'Unable to validate payment. Please try again with another payment method.',
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

        this.setEmailAddress(email);
        this.setAddress(mapShippingAddress, 'shipping');
        this.setAddress(mapBillingAddress, 'billing');

        this.submitShippingInfo()
          .then(async () => {
            resolve({
              transactionState: 'SUCCESS',
            });
          });
      });
    },

    async handleThreeDs(response) {
      const billingAddress = this.mapAddress(
        response.paymentMethodData.info.billingAddress,
        response.email,
        response.paymentMethodData.info.billingAddress.phoneNumber,
      );
      const { email } = response;
      const { androidPayCards } = JSON.parse(response.paymentMethodData.tokenizationData.token);

      // If 3DS is disabled then skip over this step.
      if (!this.threeDSEnabled) {
        return Promise.resolve({
          nonce: androidPayCards[0].nonce,
          billingAddress,
          email,
        });
      }

      const threeDSecureInstance = await braintree.threeDSecure
        .create({
          version: 2,
          client: this.instance,
        });

      return new Promise((resolve, reject) => {
        billingAddress.countryCodeAlpha2 = billingAddress.country_id;

        const threeDSecureParameters = {
          amount: parseFloat(this.cartGrandTotal / 100).toFixed(2),
          nonce: androidPayCards[0].nonce,
          bin: androidPayCards[0].details.bin,
          challengeRequested: true,
          billingAddress,
          onLookupComplete: (lookupData, next) => {
            next();
          },
        };

        threeDSecureInstance.verifyCard(threeDSecureParameters, (err, threeDSResponse) => {
          if (err) {
            if (err.code === 'THREEDS_LOOKUP_VALIDATION_ERROR') {
              const errorMessage = err.details.originalError.details.originalError.error.message;
              const message = 'Please update the address and try again.';
              if (errorMessage === 'Billing line1 format is invalid.' && billingAddress.street[0].length > 50) {
                return reject(
                  new Error(`Billing line1 must be string and less than 50 characters. ${message}`),
                );
              } if (errorMessage === 'Billing line2 format is invalid.' && billingAddress.street[1].length > 50) {
                return reject(
                  new Error(`Billing line2 must be string and less than 50 characters. ${message}`),
                );
              }
            }
            return reject(err);
          }

          const liability = {
            shifted: threeDSResponse.liabilityShifted,
            shiftPossible: threeDSResponse.liabilityShiftPossible,
          };

          if (liability.shifted || (!liability.shifted && !liability.shiftPossible)) {
            delete billingAddress.countryCodeAlpha2;

            resolve({
              nonce: threeDSResponse.nonce,
              billingAddress,
              email,
            });
          } else {
            reject(new Error('Please try again with another form of payment.'));
          }

          return true;
        });
      });
    },

    makePayment(response) {
      const payload = {
        email: response.email,
        billingAddress: response.billingAddress,
        paymentMethod: {
          method: 'braintree_googlepay',
          additional_data: {
            payment_method_nonce: response.nonce,
          },
          extension_attributes: getPaymentExtensionAttributes(),
        },
      };

      return createPayment(payload).catch(handleServiceError);
    },

    mapAddress(address, email, telephone) {
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
        region_id: this.getRegionId(address.countryCode, address.administrativeArea),
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
