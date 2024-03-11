<template>
  <div
    id="adyen-apple-pay"
    :class="!applePayLoaded ? 'text-loading' : ''" />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/AdyenStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

import getAdyenProductionMode from '@/helpers/getAdyenProductionMode';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';
import expressPaymentOnClick from '@/helpers/expressPaymentOnClick';

import createPayment from '@/services/createPayment';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/refreshCustomerData';

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
    ...mapState(useCartStore, ['cartGrandTotal']),
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
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'setShippingMethods', 'submitShippingInfo']),
    ...mapActions(useAdyenStore, [
      'getAdyenConfig',
      'getPaymentMethodsResponse',
      'getAdyenClientKey',
      'getIsAdyenAvailable',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['setEmailAddress', 'setAddressToStore', 'validatePostcode']),

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
          value: this.cartGrandTotal,
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
        onClick: (resolve, reject) => expressPaymentOnClick(resolve, reject, applePayMethod.type),
        onSubmit: () => {},
      };
    },

    async onAuthorized(resolve, reject, data) {
      const extensionAttributes = getPaymentExtensionAttributes();
      const { shippingContact, billingContact } = data.payment;
      const email = shippingContact.emailAddress;
      const telephone = shippingContact.phoneNumber;
      const shippingAddress = this.mapAddress(shippingContact, email, telephone);
      const billingAddress = this.mapAddress(billingContact, email, telephone);

      if (!this.validatePostcode('shipping', false)) {
        this.setAddressToStore(shippingAddress, 'shipping');
        await this.submitShippingInfo();
      }

      this.setAddressToStore(shippingAddress, 'shipping');
      this.setAddressToStore(billingAddress, 'billing');
      await this.submitShippingInfo();

      if (!this.countries.some(({ id }) => id === billingAddress.country_code)) {
        reject(window.ApplePaySession.STATUS_FAILURE);
        return;
      }

      const stateData = {
        paymentMethod: {
          type: 'applepay',
          applePayToken: btoa(JSON.stringify(data.payment.token.paymentData)),
        },
      };
      const payload = {
        email,
        shippingAddress,
        billingAddress,
        paymentMethod: {
          method: 'adyen_hpp',
          additional_data: {
            brand_code: 'applepay',
            stateData: JSON.stringify(stateData),
          },
          extension_attributes: extensionAttributes,
        },
      };

      const response = await createPayment(payload);
      if (response.action) {
        console.log(response.action);
      } else {
        resolve(window.ApplePaySession.STATUS_SUCCESS);
        await refreshCustomerData(getCartSectionNames());
        window.location.href = getSuccessPageUrl();
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

      this.setShippingMethods(filteredMethods);

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
      if (selectedShipping) {
        this.selectShippingMethod(selectedShipping);
      }

      // Set the billing address to the same as shipping for now. Magento doesn't use this
      // yet and it is replaced with the correct billing in the onAuthorized.
      this.setAddressToStore(address, 'shipping');
      this.setAddressToStore(address, 'billing');
      const totals = await this.submitShippingInfo();
      const newShippingMethods = this.mapShippingMethods(filteredMethods);
      const applePayShippingContactUpdate = {
        newShippingMethods,
        newTotal: {
          label: this.applePayTotal,
          amount: totals.base_grand_total.toString(),
        },
        newLineItems: [
          {
            type: 'final',
            label: 'Subtotal',
            amount: totals.subtotal.toString(),
          },
          {
            type: 'final',
            label: 'Shipping',
            amount: selectedShipping.amount.toString(),
          },
        ],
      };

      // Add discount price if available.
      if (totals.discount_amount) {
        applePayShippingContactUpdate.newLineItems.push({
          type: 'final',
          label: 'Discount',
          amount: totals.discount_amount.toString(),
        });
      }
      resolve(applePayShippingContactUpdate);
    },

    async onShippingMethodSelect(resolve, reject, data) {
      const selectedShipping = this.shippingMethods.find(({ method_code: id }) => (
        id === data.shippingMethod.identifier
      ));
      this.selectShippingMethod(selectedShipping);

      const totals = await this.submitShippingInfo();
      const applePayShippingContactUpdate = {
        newTotal: {
          type: 'final',
          label: this.applePayTotal,
          amount: totals.base_grand_total.toString(),
        },
        newLineItems: [
          {
            type: 'final',
            label: this.applPaySubtotaltitle,
            amount: totals.subtotal.toString(),
          },
          {
            type: 'final',
            label: this.applePayShippingStepTitle,
            amount: selectedShipping.amount.toString(),
          },
        ],
      };
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
        street: address.addressLines,
        city: address.locality,
        region: address.administrativeArea,
        region_id: this.getRegionId(address.countryCode.toUpperCase(), address.administrativeArea),
        country_code: address.countryCode.toUpperCase(),
        postcode: address.postalCode,
        same_as_billing: 0,
        customer_address_id: 0,
        save_in_address_book: false,
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles";
</style>
