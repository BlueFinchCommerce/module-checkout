<template>
  <div
    id="adyen-apple-pay"
    :class="!applePayLoaded ? 'text-loading' : ''"
  />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import AdyenCheckout from '@adyen/adyen-web';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import '@adyen/adyen-web/dist/adyen.css';

import getAdyenProductionMode from '@/helpers/payment/getAdyenProductionMode';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import expressPaymentOnClickDataLayer from '@/helpers/dataLayer/expressPaymentOnClickDataLayer';

import createPayment from '@/services/payments/createPaymentGraphQl';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setBillingAddressOnCart from '@/services/addresses/setBillingAddressOnCart';
import setShippingAddressesOnCart from '@/services/addresses/setShippingAddressesOnCart';

export default {
  name: 'AdyenApplePay',

  data() {
    return {
      applePayTotal: '',
      applPaySubtotaltitle: '',
      applePayShippingStepTitle: '',
      applePayNoShippingMethods: '',
      applePayLoaded: true,
    };
  },

  computed: {
    ...mapState(useAdyenStore, ['isAdyenAvailable']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'cartDiscountTotal']),
    ...mapState(useShippingMethodsStore, ['shippingMethods', 'selectedMethod']),
    ...mapState(useConfigStore, [
      'currencyCode',
      'locale',
      'countryCode',
      'websiteName',
      'countries',
      'getRegionId',
      'storeCode',
    ]),
  },

  async created() {
    if (window.ApplePaySession && window.ApplePaySession.canMakePayments) {
      this.applePayLoaded = false;
    } else {
      return;
    }

    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCart();
    }

    await this.getIsAdyenAvailable();

    // Early return is Adyen isn't available.
    if (!this.isAdyenAvailable) {
      this.applePayLoaded = true;
      return;
    }

    await this.getAdyenConfig();
    const clientKey = await this.getAdyenClientKey();
    const paymentMethodsResponse = await this.getPaymentMethodsResponse();

    const applePayMethod = this.getApplePayMethod(paymentMethodsResponse);

    if (!applePayMethod) {
      this.applePayLoaded = true;
      // Return early if Apple Pay isn't enabled in Adyen.
      return;
    }

    const applePayConfiguration = this.getApplePayConfiguration(applePayMethod);
    const configuration = {
      locale: this.locale,
      environment: getAdyenProductionMode() ? 'LIVE' : 'TEST',
      analytics: {
        enabled: false,
      },
      risk: {
        enabled: false,
      },
      clientKey,
    };
    const checkout = await AdyenCheckout(configuration);
    const applePayComponent = checkout.create('applepay', applePayConfiguration);
    applePayComponent
      .isAvailable()
      .then(() => {
        applePayComponent.mount('#adyen-apple-pay');
        this.expressPaymentsLoad();
      })
      .catch(() => {
        console.warn('Apple Pay is not available');
      });

    this.applePayTotal = this.websiteName;
    this.applPaySubtotaltitle = this.$t('orderSummary.subtotalTitle');
    this.applePayShippingStepTitle = this.$t('progressBar.shippingStepTitle');
    this.applePayNoShippingMethods = this.$t('errorMessages.applePayNoShippingMethods');
  },

  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'submitShippingInfo']),
    ...mapActions(useAdyenStore, [
      'getAdyenConfig',
      'getPaymentMethodsResponse',
      'getAdyenClientKey',
      'getIsAdyenAvailable',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['submitEmail', 'setAddressToStore', 'validatePostcode']),

    getApplePayMethod(paymentMethodsResponse) {
      return paymentMethodsResponse.paymentMethods.find(({ type }) => (
        type === 'applepay'
      ));
    },

    expressPaymentsLoad() {
      this.$emit('expressPaymentsLoad', 'true');
      this.applePayLoaded = true;
    },

    getApplePayConfiguration(applePayMethod) {
      return {
        amount: {
          valie: parseFloat(this.cartGrandTotal / 100).toFixed(2),
          currency: this.currencyCode,
        },
        currencyCode: this.currencyCode,
        countryCode: this.countryCode,
        totalPriceLabel: this.websiteName,
        environment: getAdyenProductionMode() ? 'LIVE' : 'TEST',
        configuration: {
          domainName: window.location.hostname,
          merchantName: applePayMethod.configuration.merchantName,
          merchantId: applePayMethod.configuration.merchantId,
        },
        requiredShippingContactFields: ['postalAddress', 'name', 'email', 'phone'],
        requiredBillingContactFields: ['postalAddress', 'name'],
        shippingMethods: [],
        onAuthorized: this.onAuthorized.bind(this),
        onShippingContactSelected: this.onShippingContactSelect.bind(this),
        onShippingMethodSelected: this.onShippingMethodSelect.bind(this),
        onClick: (resolve, reject) => this.onClick(resolve, reject, applePayMethod.type),
        onSubmit: () => {},
      };
    },

    onClick(resolve, reject, type) {
      // Check that the agreements (if any) are valid.
      const isValid = this.validateAgreements();

      if (!isValid) {
        return false;
      }

      return expressPaymentOnClickDataLayer(resolve, reject, type);
    },

    async onAuthorized(resolve, reject, data) {
      const { shippingContact, billingContact } = data.payment;
      const email = shippingContact.emailAddress;
      const telephone = shippingContact.phoneNumber;
      const shippingAddress = this.mapAddress(shippingContact, email, telephone);
      const billingAddress = this.mapAddress(billingContact, email, telephone);

      if (!this.countries.some(({ id }) => id === billingAddress.country_code)) {
        reject(window.ApplePaySession.STATUS_FAILURE);
        return;
      }

      try {
        this.submitEmail(email)
          .then(() => (
            Promise.all([
              setBillingAddressOnCart(billingAddress),
              setShippingAddressesOnCart(shippingAddress),
            ])
          ))
          .then(() => {
            const stateData = JSON.stringify({
              paymentMethod: {
                applePayToken: btoa(JSON.stringify(data.payment.token.paymentData)),
                type: 'applepay',
              },
              browserInfo: this.browserInfo,
            });

            const paymentMethod = {
              code: 'adyen_hpp',
              adyen_additional_data_hpp: {
                brand_code: 'applepay',
                stateData,
              },
            };

            return createPayment(paymentMethod);
          })
          .then(async () => {
            resolve(window.ApplePaySession.STATUS_SUCCESS);
            await refreshCustomerData(getCartSectionNames());
            window.location.href = getSuccessPageUrl();
          });
      } catch (error) {
        const errors = {
          errors: [
            new window.ApplePayError('unknown', 'country', error.message),
          ],
        };

        resolve(errors);
      }
    },

    async onShippingContactSelect(resolve, reject, data) {
      const address = {
        city: data.shippingContact.locality,
        region: data.shippingContact.administrativeArea,
        region_id: this.getRegionId(data.shippingContact.countryCode, data.shippingContact.administrativeArea),
        country_code: data.shippingContact.countryCode.toUpperCase(),
        postcode: data.shippingContact.postalCode,
        street: ['0'],
      };

      this.address = address;

      const result = await getShippingMethods(address);

      const filteredMethods = result.filter(({ method_code: methodCode }) => (
        methodCode !== 'nominated_delivery'
      ));

      // If there are no shipping methods available show an error.
      if (!filteredMethods.length) {
        const errors = {
          errors: [
            new window.ApplePayError('addressUnserviceable', 'postalAddress', this.applePayNoShippingMethods),
          ],
          newTotal: {
            label: this.applePayTotal,
            amount: '0.00',
            type: 'pending',
          },
        };
        resolve(errors);
        return;
      }

      // Set the shipping method back to the first available method.
      const selectedShipping = filteredMethods[0];

      await this.submitShippingInfo(selectedShipping.carrier_code, selectedShipping.method_code);
      const newShippingMethods = this.mapShippingMethods(filteredMethods);
      const applePayShippingContactUpdate = {
        newShippingMethods,
        newTotal: {
          label: this.applePayTotal,
          amount: parseFloat(this.cartGrandTotal / 100).toFixed(2),
        },
        newLineItems: [
          {
            type: 'final',
            label: 'Subtotal',
            amount: this.cart.prices.subtotal_including_tax.value.toString(),
          },
          {
            type: 'final',
            label: 'Shipping',
            amount: selectedShipping.amount.value.toString(),
          },
        ],
      };

      // Add discount price if available.
      if (this.cartDiscountTotal) {
        applePayShippingContactUpdate.newLineItems.push({
          type: 'final',
          label: 'Discount',
          amount: this.cartDiscountTotal.toString(),
        });
      }

      resolve(applePayShippingContactUpdate);
    },

    async onShippingMethodSelect(resolve, reject, data) {
      const selectedShipping = this.shippingMethods.find(({ method_code: id }) => (
        id === data.shippingMethod.identifier
      ));

      await this.submitShippingInfo(selectedShipping.carrier_code, selectedShipping.method_code);
      const applePayShippingContactUpdate = {
        newTotal: {
          label: this.applePayTotal,
          amount: parseFloat(this.cartGrandTotal / 100).toFixed(2),
        },
        newLineItems: [
          {
            type: 'final',
            label: 'Subtotal',
            amount: this.cart.prices.subtotal_including_tax.value.toString(),
          },
          {
            type: 'final',
            label: 'Shipping',
            amount: selectedShipping.amount.value.toString(),
          },
        ],
      };

      // Add discount price if available.
      if (this.cartDiscountTotal) {
        applePayShippingContactUpdate.newLineItems.push({
          type: 'final',
          label: 'Discount',
          amount: this.cartDiscountTotal.toString(),
        });
      }

      resolve(applePayShippingContactUpdate);
    },

    mapShippingMethods(shippingMethods) {
      return shippingMethods.map((shippingMethod) => (
        {
          label: shippingMethod.method_title,
          detail: shippingMethod.carrier_title || '',
          amount: shippingMethod.amount.toString(),
          identifier: shippingMethod.method_code,
          carrierCode: shippingMethod.carrier_code,
        }
      ));
    },

    // Map the address provided by ApplePay into something useable.
    mapAddress(address, email, telephone) {
      return {
        email,
        telephone,
        firstname: address.givenName,
        lastname: address.familyName,
        company: address.company || '',
        street: address.addressLines,
        city: address.locality,
        region: address.administrativeArea,
        region_id: this.getRegionId(address.countryCode.toUpperCase(), address.administrativeArea),
        country_code: address.countryCode.toUpperCase(),
        postcode: address.postalCode,
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles";
</style>
