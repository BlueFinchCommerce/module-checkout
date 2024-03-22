<template>
  <button class="apple-pay-button apple-pay-button-black">Apple Pay</button>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import usePaymentStore from '@/stores/PaymentStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import getAdyenProductionMode from '@/helpers/getAdyenProductionMode';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';
import expressPaymentOnClick from '@/helpers/expressPaymentOnClick';

import createPayment from '@/services/createPayment';
import getShippingMethods from '@/services/getShippingMethods';
import refreshCustomerData from '@/services/refreshCustomerData';

export default {
  name: 'AdyenApplePay',

  data() {
    return {
      applePayTotal: '',
      applPaySubtotaltitle: '',
      applePayShippingStepTitle: '',
      applePayNoShippingMethods: '',
    };
  },

  computed: {
    ...mapState(useCartStore, ['cartGrandTotal']),
    ...mapState(useShippingMethodsStore, ['shippingMethods', 'selectedMethod']),
    ...mapState(useConfigStore, ['currencyCode', 'locale', 'countryCode', 'stateRequired', 'websiteName', 'countries']),
  },

  methods: {
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'setShippingMethods', 'submitShippingInfo']),
    ...mapActions(usePaymentStore, ['getPaymentMethodsResponse', 'getAdyenClientKey']),
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'getCartTotals']),
    ...mapActions(useConfigStore, ['getStoreConfig', 'getAdyenConfig']),
    ...mapActions(useCustomerStore, ['setEmailAddress', 'setAddress', 'validatePostcode']),

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
        this.setAddress(shippingAddress, 'shipping');
        await this.submitShippingInfo();
      }

      this.setAddress(shippingAddress, 'shipping');
      this.setAddress(billingAddress, 'billing');
      await this.submitShippingInfo();

      if (!this.countries.some(({ id }) => id === billingAddress.country_id)) {
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
        country_id: data.shippingContact.countryCode.toUpperCase(),
        postcode: data.shippingContact.postalCode,
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
      this.setAddress(address, 'shipping');
      this.setAddress(address, 'billing');
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
      const statesRequired = this.stateRequired;
      let region;
      if (statesRequired.indexOf(address.countryCode) !== -1) {
        const country = this.countries.find((cty) => cty.id === address.countryCode);
        if (country.available_regions && country.available_regions.length) {
          region = country.available_regions.find((rgin) => (
            rgin.name === address.administrativeArea
          ));
        }
      }

      return {
        email,
        telephone,
        firstname: address.givenName,
        lastname: address.familyName,
        street: address.addressLines,
        city: address.locality,
        region: address.administrativeArea,
        region_id: region ? region.id : 0,
        country_id: address.countryCode.toUpperCase(),
        postcode: address.postalCode,
        same_as_billing: 0,
        customer_address_id: 0,
        save_in_address_book: 0,
      };
    },
  },
};
</script>

<style lang="scss">
@import "./styles";
</style>
