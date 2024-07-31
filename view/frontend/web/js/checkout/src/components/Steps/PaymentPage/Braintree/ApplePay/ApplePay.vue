<template>
  <div
    v-if="applePayAvailable"
    id="braintree-apple-pay"
    :class="!applePayLoaded ? 'text-loading' : 'braintree-apple-pay'"
    :data-cy="'instant-checkout-braintreeApplePay'"
    @keydown.enter="click"
    @click="click"
  />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { markRaw } from 'vue';

import braintree from 'braintree-web';

import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import expressPaymentOnClickDataLayer from '@/helpers/dataLayer/expressPaymentOnClickDataLayer';

import createPayment from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

export default {
  name: 'BraintreeApplePay',

  data() {
    return {
      applePayAvailable: false,
      applePayTotal: '',
      instance: null,
      applePayInstance: null,
      dataCollectorInstance: null,
      applePayLoaded: true,
      shippingMethods: [],
      applePayConfig: null,
      key: 'braintreeApplePay',
    };
  },

  computed: {
    ...mapState(useBraintreeStore, ['clientToken']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'cartDiscountTotal']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
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
    if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments) {
      return;
    }

    this.addExpressMethod(this.key);
    this.applePayLoaded = false;
    this.applePayAvailable = true;

    await this.getInitialConfig();
    await this.getCart();

    this.applePayConfig = this.availableMethods.find((method) => (
      method.code === 'braintree_applepay'
    ));

    if (!this.applePayConfig) {
      // Early return if Braintree Apple Pay isn't enabled.
      this.applePayLoaded = true;
      this.removeExpressMethod(this.key);
      return;
    }

    await this.createClientToken();

    this.instance = await markRaw(braintree.client.create({
      authorization: this.clientToken,
    }));

    this.applePayTotal = this.websiteName;

    braintree.applePay.create({
      client: this.instance,
    }, (error, applePayInstance) => {
      window.ApplePaySession.canMakePaymentsWithActiveCard(
        applePayInstance.merchantIdentifier,
      ).then(() => {
        this.applePayInstance = markRaw(applePayInstance);
        this.applePayLoaded = true;
      });
    });

    braintree.dataCollector.create({
      client: this.instance,
    }, (error, dataCollectorInstance) => {
      this.dataCollectorInstance = markRaw(dataCollectorInstance);
    });
  },

  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'submitShippingInfo']),
    ...mapActions(usePaymentStore, [
      'addExpressMethod',
      'removeExpressMethod',
      'setErrorMessage',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, ['submitEmail', 'setAddressToStore']),
    ...mapActions(useBraintreeStore, ['createClientToken']),
    ...mapActions(useRecaptchaStore, ['validateToken']),

    click(event) {
      event.preventDefault();
      this.setErrorMessage('');
      // Check that the agreements (if any) and recpatcha is valid.
      const agreementsValid = this.validateAgreements();
      const recaptchaValid = this.validateToken('placeOrder');

      if (!agreementsValid || !recaptchaValid) {
        return;
      }

      expressPaymentOnClickDataLayer(this.applePayConfig.code);

      try {
        const requiredShippingContactFields = ['name', 'email', 'phone'];

        if (!this.cart.is_virtual) {
          requiredShippingContactFields.push('postalAddress');
        }

        const paymentRequest = this.applePayInstance.createPaymentRequest({
          total: {
            label: this.websiteName,
            amount: parseFloat(this.cartGrandTotal / 100).toFixed(2),
          },
          requiredShippingContactFields,
          requiredBillingContactFields: ['postalAddress', 'name'],
        });
        const session = new window.ApplePaySession(3, paymentRequest);

        session.onvalidatemerchant = (validateEvent) => this.onValidateMerchant(validateEvent, session);
        session.onpaymentauthorized = (data) => this.onAuthorized(data, session);

        if (!this.cart.is_virtual) {
          session.onshippingcontactselected = (data) => this.onShippingContactSelect(data, session);
          session.onshippingmethodselected = (data) => this.onShippingMethodSelect(data, session);
        }

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

    async onAuthorized(data, session) {
      const { shippingContact, billingContact } = data.payment;
      const email = shippingContact.emailAddress;
      const telephone = shippingContact.phoneNumber;
      const billingAddress = this.mapAddress(billingContact, email, telephone);

      let shippingAddress = null;

      if (!this.cart.is_virtual) {
        shippingAddress = this.mapAddress(shippingContact, email, telephone);
      }

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

        try {
          setAddressesOnCart(shippingAddress, billingAddress, email)
            .then(() => {
              const payment = {
                email,
                paymentMethod: {
                  method: 'braintree_applepay',
                  additional_data: {
                    payment_method_nonce: payload.nonce,
                    device_data: this.dataCollectorInstance.deviceData,
                  },
                  extension_attributes: getPaymentExtensionAttributes(),
                },
              };

              return createPayment(payment);
            })
            .then(async () => {
              session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
              await refreshCustomerData(getCartSectionNames());
              window.location.href = getSuccessPageUrl();
            });
        } catch (error) {
          console.log(error);
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
        telephone: '000000000',
        firstname: 'UNKNOWN',
        lastname: 'UNKNOWN',
      };

      this.address = address;

      const result = await getShippingMethods(address);
      const methods = result.shipping_addresses[0].available_shipping_methods;

      const filteredMethods = methods.filter(({ method_code: methodCode }) => (
        methodCode !== 'nominated_delivery'
      ));

      this.shippingMethods = filteredMethods;

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

      session.completeShippingContactSelection(applePayShippingContactUpdate);
    },

    async onShippingMethodSelect(data, session) {
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
      const regionId = this.getRegionId(address.countryCode.toUpperCase(), address.administrativeArea);
      return {
        email,
        telephone,
        firstname: address.givenName,
        lastname: address.familyName,
        company: address.company || '',
        street: address.addressLines,
        city: address.locality,
        country_code: address.countryCode.toUpperCase(),
        postcode: address.postalCode,
        region: {
          ...(address.administrativeArea ? { region: address.administrativeArea } : {}),
          ...(regionId ? { region_id: regionId } : {}),
        },
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
@import "@/components/Steps/PaymentPage/Braintree/ApplePay/styles.scss";
</style>
