<template>
  <div
    v-if="applePayAvailable"
    id="braintree-apple-pay"
    :class="!applePayLoaded ? 'text-loading' : 'braintree-apple-pay'"
    @keydown.enter="click"
    @click="click"
  />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { markRaw } from 'vue';

import braintree from 'braintree-web';

import usePaymentStore from '@/stores/PaymentStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useBraintreeStore from '@/stores/BraintreeStore';

import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';

import createPayment from '@/services/createPayment';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/refreshCustomerData';

export default {
  name: 'BraintreeApplePay',

  data() {
    return {
      applePayAvailable: false,
      instance: null,
      applePayInstance: null,
      dataCollectorInstance: null,
      applePayLoaded: true,
    };
  },

  computed: {
    ...mapState(useBraintreeStore, ['clientToken']),
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
    ...mapState(usePaymentStore, ['availableMethods']),
  },

  async created() {
    // If the browser doesn't support Apple Pay then return early.
    if (window.ApplePaySession && window.ApplePaySession.canMakePayments) {
      this.applePayAvailable = true;
      this.applePayLoaded = false;
    } else {
      return;
    }

    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCart();
    }

    await this.getPaymentMethods();

    const applePayConfig = this.availableMethods.find((method) => (
      method.code === 'braintree_applepay'
    ));

    if (!applePayConfig) {
      this.applePayLoaded = true;
      return; // Early return if Braintree Apple Pay isn't enabled.
    }

    await this.createClientToken();

    this.instance = await markRaw(braintree.client.create({
      authorization: this.clientToken,
    }));

    braintree.applePay.create({
      client: this.instance,
    }, (error, applePayInstance) => {
      window.ApplePaySession.canMakePaymentsWithActiveCard(
        applePayInstance.merchantIdentifier,
      ).then(() => {
        this.applePayInstance = markRaw(applePayInstance);

        this.expressPaymentsLoad();
      });
    });

    braintree.dataCollector.create({
      client: this.instance,
    }, (error, dataCollectorInstance) => {
      this.dataCollectorInstance = markRaw(dataCollectorInstance);
    });
  },

  methods: {
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'setShippingMethods', 'submitShippingInfo']),
    ...mapActions(usePaymentStore, [
      'getPaymentMethods',
      'setErrorMessage',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['setEmailAddress', 'setAddressToStore', 'validatePostcode']),
    ...mapActions(useBraintreeStore, ['getBraintreeConfig', 'createClientToken']),

    click(event) {
      event.preventDefault();

      try {
        const paymentRequest = this.applePayInstance.createPaymentRequest({
          total: {
            label: this.websiteName,
            amount: parseFloat(this.cartGrandTotal / 100).toFixed(2),
          },
          requiredShippingContactFields: ['postalAddress', 'name', 'email', 'phone'],
          requiredBillingContactFields: ['postalAddress', 'name'],
        });
        const session = new window.ApplePaySession(3, paymentRequest);

        session.onvalidatemerchant = (validateEvent) => this.onValidateMerchant(validateEvent, session);
        session.onshippingcontactselected = (data) => this.onShippingContactSelect(data, session);
        session.onShippingMethodSelected = (data) => this.onShippingMethodSelect(data, session);
        session.onpaymentauthorized = (data) => this.onAuthorized(data, session);

        session.begin();
      } catch (err) {
        this.setApplePayError();
      }
    },

    onValidateMerchant(event, session) {
      return this.applePayInstance.performValidation(
        {
          validationURL: event.validationURL,
          displayName: this.websiteName,
        },
        (validationErr, merchantSession) => {
          if (validationErr) {
            session.abort();
            console.error(
              'Braintree ApplePay Error validating merchant:',
              validationErr,
            );
            this.setApplePayError();
            return;
          }

          session.completeMerchantValidation(merchantSession);
        },
      );
    },

    getApplePayMethod(paymentMethodsResponse) {
      return paymentMethodsResponse.paymentMethods.find(({ type }) => (
        type === 'applepay'
      ));
    },

    expressPaymentsLoad() {
      this.$emit('expressPaymentsLoad', 'true');
      this.applePayLoaded = true;
    },

    async onAuthorized(data, session) {
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
        session.completePayment(window.ApplePaySession.STATUS_FAILURE);
        return;
      }

      this.applePayInstance.tokenize({
        token: data.payment.token,
      }, async (tokenizeErr, payload) => {
        if (tokenizeErr) {
          console.error('Error tokenizing Apple Pay:', tokenizeErr);
          session.completePayment(window.ApplePaySession.STATUS_FAILURE);
          return;
        }

        const payment = {
          email,
          billingAddress,
          paymentMethod: {
            method: 'braintree_applepay',
            additional_data: {
              payment_method_nonce: payload.nonce,
              device_data: this.dataCollectorInstance.deviceData,
            },
            extension_attributes: extensionAttributes,
          },
        };

        try {
          await createPayment(payment);
          session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
          await refreshCustomerData(['cart']);
          window.location.href = getSuccessPageUrl();
        } catch (error) {
          session.completePayment(window.ApplePaySession.STATUS_FAILURE);
        }
      });
    },

    async onShippingContactSelect(data, session) {
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
            label: this.websiteName,
            amount: '0.00',
            type: 'pending',
          },
        };
        session.completeShippingContactSelection(errors);
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
          label: this.websiteName,
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
            amount: selectedShipping.amount.value.toString(),
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
      session.completeShippingContactSelection(applePayShippingContactUpdate);
    },

    async onShippingMethodSelect(data, session) {
      const selectedShipping = this.shippingMethods.find(({ method_code: id }) => (
        id === data.shippingMethod.identifier
      ));
      this.selectShippingMethod(selectedShipping);

      const totals = await this.submitShippingInfo();
      const applePayShippingContactUpdate = {
        newTotal: {
          type: 'final',
          label: this.websiteName,
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
            amount: selectedShipping.amount.value.toString(),
          },
        ],
      };
      session.completeShippingMethodSelection(applePayShippingContactUpdate);
    },

    mapShippingMethods(shippingMethods) {
      return shippingMethods.map((shippingMethod) => (
        {
          label: shippingMethod.method_title,
          detail: shippingMethod.carrier_title || '',
          amount: shippingMethod.amount.value.toString(),
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

    setApplePayError() {
      this.setErrorMessage(
        "We're unable to take payments through Apple Pay at the moment. Please try an alternative payment method.",
      );
    },
  },
};
</script>

<style lang="scss">
@import "@/components/Braintree/ApplePay/styles.scss";
</style>
