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

import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import formatPrice from '@/helpers/payment/formatPrice';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';

import createPayment from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

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
    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCart();
    }

    await this.getBraintreeConfig();
    await this.getPaymentMethods();

    const googlePayConfig = this.availableMethods.find((method) => (
      method.code === 'braintree_googlepay'
    ));

    if (!googlePayConfig) {
      this.$emit('expressPaymentsLoad', 'false');
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
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, ['getBraintreeConfig', 'createClientToken']),
    ...mapActions(useShippingMethodsStore, ['submitShippingInfo']),
    ...mapActions(usePaymentStore, ['getPaymentMethods', 'setErrorMessage']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['submitEmail']),

    expressPaymentsLoad() {
      this.$emit('expressPaymentsLoad', 'true');
      this.googlePayLoaded = true;
    },

    onClick() {
      // Check that the agreements (if any) are valid.
      const isValid = this.validateAgreements();

      if (!isValid) {
        return false;
      }

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
                message: this.$t('errorMessages.googlePayNoShippingMethods'),
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

        const { shippingAddress } = data;
        const { phoneNumber: shippingPhoneNumber } = shippingAddress;
        const mapShippingAddress = this.mapAddress(shippingAddress, email, shippingPhoneNumber);

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

      const threeDSecureInstance = await braintree.threeDSecure
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
      const payment = {
        email: response.email,
        paymentMethod: {
          method: 'braintree_googlepay',
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
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
