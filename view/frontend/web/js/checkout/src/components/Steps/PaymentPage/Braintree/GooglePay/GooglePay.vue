<template>
  <div
    id="braintree-google-pay"
    ref="braintreeGooglePay"
    :class="!googlePayLoaded ? 'text-loading' : ''"
    :data-cy="'instant-checkout-braintreeGooglePay'"
  />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { markRaw } from 'vue';

import braintree from 'braintree-web';

import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useLoadingStore from '@/stores/LoadingStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import expressPaymentOnClickDataLayer from '@/helpers/dataLayer/expressPaymentOnClickDataLayer';
import formatPrice from '@/helpers/payment/formatPrice';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import handleServiceError from '@/helpers/validation/handleServiceError';

import createPayment from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

// Extensions
import functionExtension from '@/extensions/functionExtension';

export default {
  name: 'BraintreeGooglePay',
  data() {
    return {
      googlePayNoShippingMethods: '',
      instance: null,
      googleClient: null,
      googlePaymentInstance: null,
      googlePayLoaded: false,
      threeDSecureInstance: null,
      key: 'braintreeGooglePay',
      method: 'braintree_googlepay',
    };
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'environment',
      'clientToken',
      'google',
      'threeDSEnabled',
      'threeDSThresholdAmount',
      'alwaysRequestThreeDS',
    ]),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
    ...mapState(useConfigStore, [
      'currencyCode',
      'locale',
      'countryCode',
      'countries',
      'getRegionId',
      'storeCode',
    ]),
    ...mapState(usePaymentStore, ['availableMethods']),
  },
  async created() {
    this.addExpressMethod(this.key);
    await this.getInitialConfig();
    await this.getCart();

    const googlePayConfig = this.availableMethods.find((method) => (
      method.code === this.method
    ));

    if (!googlePayConfig) {
      // Early return if Braintree Google Pay isn't enabled.
      this.removeExpressMethod(this.key);
      this.googlePayLoaded = true;
      return;
    }

    await this.createClientToken();

    this.googleClient = markRaw(new window.google.payments.api.PaymentsClient({
      environment: this.environment === 'sandbox' ? 'TEST' : 'PRODUCTION',
      paymentDataCallbacks: {
        ...(this.cart.is_virtual ? {} : { onPaymentDataChanged: this.onPaymentDataChanged }),
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
        }).then(async (isReadyToPay) => {
          if (isReadyToPay) {
            await functionExtension('onBraintreeExpressInit');
            const button = this.googleClient.createButton({
              buttonColor: this.google.buttonColor,
              buttonType: 'buy',
              buttonSizeMode: 'fill',
              onClick: () => this.onClick(googlePayConfig.code),
            });
            this.$refs.braintreeGooglePay.append(button);
            this.googlePayLoaded = true;
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
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, ['createClientToken']),
    ...mapActions(useLoadingStore, ['setLoadingState']),
    ...mapActions(useShippingMethodsStore, ['submitShippingInfo', 'setNotClickAndCollect']),
    ...mapActions(usePaymentStore, [
      'addExpressMethod',
      'removeExpressMethod',
      'setErrorMessage',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, ['submitEmail']),

    onClick(type) {
      this.setErrorMessage('');
      // Check that the agreements (if any) is valid.
      const agreementsValid = this.validateAgreements();

      if (!agreementsValid) {
        return false;
      }

      this.setNotClickAndCollect();

      const callbackIntents = ['PAYMENT_AUTHORIZATION'];

      if (!this.cart.is_virtual) {
        callbackIntents.push('SHIPPING_ADDRESS', 'SHIPPING_OPTION');
      }

      const paymentRequest = {
        transactionInfo: {
          countryCode: this.countryCode,
          currencyCode: this.currencyCode,
          totalPriceStatus: 'FINAL',
          totalPrice: (this.cartGrandTotal / 100).toString(),
        },
        emailRequired: true,
        shippingAddressRequired: !this.cart.is_virtual,
        shippingAddressParameters: {
          phoneNumberRequired: !this.cart.is_virtual,
        },
        shippingOptionRequired: !this.cart.is_virtual,
        callbackIntents,
      };

      if (this.environment !== 'sandbox') {
        paymentRequest.merchantInfo = {
          merchantId: this.google.merchantId,
        };
      }

      const paymentDataRequest = this.googlePaymentInstance.createPaymentDataRequest(paymentRequest);

      const cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
      cardPaymentMethod.parameters.billingAddressRequired = true;
      cardPaymentMethod.parameters.billingAddressParameters = {
        format: 'FULL',
        phoneNumberRequired: true,
      };

      expressPaymentOnClickDataLayer(type);

      this.setLoadingState(true);

      return this.googleClient.loadPaymentData(paymentDataRequest)
        .then(this.handleThreeDs)
        .then(this.makePayment)
        .then(() => refreshCustomerData(['cart']))
        .then(() => { window.location.href = getSuccessPageUrl(); })
        .catch((err) => {
          this.setLoadingState(false);

          try {
            handleServiceError(err);
          } catch (formattedError) {
            this.setErrorMessage(formattedError);
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
          city: data.shippingAddress.locality,
          country_code: data.shippingAddress.countryCode,
          postcode: data.shippingAddress.postalCode,
          region: data.shippingAddress.administrativeArea,
          region_id: this.getRegionId(data.shippingAddress.countryCode, data.shippingAddress.administrativeArea),
          street: ['0'],
          telephone: '000000000',
          firstname: 'UNKNOWN',
          lastname: 'UNKNOWN',
        };

        getShippingMethods(address, this.method, true).then(async (response) => {
          const methods = response.shipping_addresses[0].available_shipping_methods;

          const shippingMethods = methods.map((shippingMethod) => {
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
            ? methods[0]
            : methods.find(({ method_code: id }) => id === data.shippingOptionData.id) || methods[0];

          await this.submitShippingInfo(selectedShipping.carrier_code, selectedShipping.method_code);
          this.setLoadingState(true);

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
        const mapBillingAddress = this.mapAddress(billingAddress, email, phoneNumber);

        let mapShippingAddress = null;

        if (!this.cart.is_virtual) {
          const { shippingAddress } = data;
          const { phoneNumber: shippingPhoneNumber } = shippingAddress;
          mapShippingAddress = this.mapAddress(shippingAddress, email, shippingPhoneNumber);
        }

        try {
          setAddressesOnCart(mapShippingAddress, mapBillingAddress, email)
            .then(() => {
              resolve({
                transactionState: 'SUCCESS',
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

    async handleThreeDs(response) {
      this.setLoadingState(true);
      const billingAddress = this.mapAddress(
        response.paymentMethodData.info.billingAddress,
        response.email,
        response.paymentMethodData.info.billingAddress.phoneNumber,
      );
      billingAddress.region = billingAddress.region.region_code || billingAddress.region.region;
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

      this.threeDSecureInstance = await braintree.threeDSecure
        .create({
          version: 2,
          client: this.instance,
        });

      return new Promise((resolve, reject) => {
        billingAddress.countryCodeAlpha2 = billingAddress.country_code;

        const price = this.cartGrandTotal / 100;
        const threshold = this.threeDSThresholdAmount;
        const challengeRequested = this.alwaysRequestThreeDS || price >= threshold;

        const threeDSecureParameters = {
          amount: parseFloat(this.cartGrandTotal / 100).toFixed(2),
          nonce: androidPayCards[0].nonce,
          bin: androidPayCards[0].details.bin,
          challengeRequested,
          billingAddress,
          onLookupComplete: (lookupData, next) => {
            next();
          },
        };

        this.threeDSecureInstance.verifyCard(threeDSecureParameters, (err, threeDSResponse) => {
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
      const payment = {
        email: response.email,
        paymentMethod: {
          method: this.method,
          additional_data: {
            payment_method_nonce: response.nonce,
          },
          extension_attributes: getPaymentExtensionAttributes(),
        },
      };

      return createPayment(payment);
    },

    mapAddress(address, email, telephone) {
      const [firstname, ...lastname] = address.name.split(' ');
      const regionId = this.getRegionId(address.countryCode, address.administrativeArea);
      return {
        street: [
          address.address1,
          address.address2,
        ],
        postcode: address.postalCode,
        country_code: address.countryCode,
        company: address.company || '',
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
  unmounted() {
    if (this.instance) {
      this.instance.teardown();
    }

    if (this.googlePaymentInstance) {
      this.googlePaymentInstance.teardown();
    }

    if (this.threeDSecureInstance) {
      this.threeDSecureInstance.teardown();
    }
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
