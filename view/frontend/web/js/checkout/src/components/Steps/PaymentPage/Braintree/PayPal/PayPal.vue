<template>
  <div
    id="braintree-paypal"
    ref="braintreePayPal"
    :class="!paypalLoaded ? 'text-loading' : ''"
  />
  <div id="braintree-threeds-container" />
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { markRaw } from 'vue';

import braintree from 'braintree-web';

import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import getAdditionalPaymentData from '@/helpers/payment/getAdditionalPaymentData';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import handleServiceError from '@/helpers/validation/handleServiceError';

import createPayment from '@/services/payments/createPayment';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

export default {
  name: 'BraintreePayPal',
  data() {
    return {
      googlePayNoShippingMethods: '',
      instance: null,
      googleClient: null,
      paypalInstance: null,
      paypalLoaded: false,
    };
  },
  computed: {
    ...mapState(useBraintreeStore, ['clientToken', 'environment', 'paypal']),
    ...mapState(useCartStore, ['cartGrandTotal']),
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

    await this.getPaymentMethods();
    await this.getBraintreeConfig();

    const paypalConfig = this.availableMethods.find((method) => (
      method.code === 'braintree_paypal'
    ));

    if (!paypalConfig) {
      this.paypalLoaded = true;
      return; // Early return if Braintree PayPal isn't enabled.
    }

    await this.createClientToken();

    this.instance = await markRaw(braintree.client.create({
      authorization: this.clientToken,
    }));

    braintree.paypalCheckout.create({
      client: this.instance,
    }, (error, paypalInstance) => {
      // If there is no reference to the container then run a teardown and return early.
      if (!this.$refs.braintreePayPal) {
        paypalInstance.teardown();
        return;
      }

      this.paypalInstance = markRaw(paypalInstance);
      paypalInstance.loadPayPalSDK({
        currency: this.currencyCode,
        intent: 'capture',
        vault: 'false',
      }, () => {
        const renderData = {
          env: this.environment,
          commit: true,
          style: {
            label: this.paypal.buttonLabel,
            size: 'responsive',
            shape: this.paypal.buttonShape,
            color: this.paypal.buttonColor,
            tagline: false,
          },
          fundingSource: window.paypal.FUNDING.PAYPAL,
          offerCredit: false,
          createOrder: () => paypalInstance.createPayment({
            amount: parseFloat(this.cartGrandTotal / 100).toFixed(2),
            flow: 'checkout',
            currency: this.currencyCode,
            enableShippingAddress: true,
            intent: 'capture',
            lineItems: this.getPayPalLineItems(false),
            shippingOptions: [],
          }),
          onShippingChange: async (data) => {
            const address = {
              country_code: data.shipping_address.country_code,
              postcode: data.shipping_address.postal_code,
              region: data.shipping_address.state,
              region_id: this.getRegionId(data.shipping_address.country_code, data.shipping_address.state),
              street: ['0'],
            };
            const shippingMethods = await getShippingMethods(address);

            // Filter out nominated day as this isn't available inside of PayPal.
            const fShippingMethods = shippingMethods.filter((sid) => sid.id !== 'nominated_delivery');

            const selectedShipping = !data.selected_shipping_option
              ? fShippingMethods[0]
              : fShippingMethods.find(({ method_code: id }) => (
                id === data.selected_shipping_option.id)) || fShippingMethods[0];

            this.selectShippingMethod(selectedShipping);

            const shippingOptions = fShippingMethods.map((method) => (
              {
                id: method.method_code,
                label: method.method_title,
                type: 'SHIPPING',
                selected: selectedShipping.method_code === method.method_code,
                amount: {
                  value: method.amount.value.toString(),
                  currency: this.currencyCode,
                },
              }
            ));

            const amount = this.cartGrandTotal / 100 + selectedShipping.amount;

            return paypalInstance.updatePayment({
              paymentId: data.paymentId,
              amount,
              currency: this.currencyCode,
              shippingOptions,
              lineItems: this.getPayPalLineItems(false),
            });
          },
          onApprove: (data) => paypalInstance
            .tokenizePayment(data)
            .then(this.setShippingInformation)
            .then(this.getPaymentData)
            .then(createPayment)
            .then(() => refreshCustomerData(['cart']))
            .then(this.redirectToSuccess)
            .catch((err) => {
              try {
                handleServiceError(err);
              } catch (formattedError) {
                this.setErrorMessage(formattedError);
              }
            }),
          onError: (err) => {
            this.setErrorMessage(err);
          },
        };

        this.expressPaymentsLoad();
        return window.paypal.Buttons(renderData).render('#braintree-paypal');
      });
    });
  },
  methods: {
    ...mapActions(useBraintreeStore, ['getBraintreeConfig', 'createClientToken', 'getPayPalLineItems']),
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'submitShippingInfo']),
    ...mapActions(usePaymentStore, ['getPaymentMethods', 'setErrorMessage']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig', 'getAdyenConfig']),
    ...mapActions(useCustomerStore, ['setEmailAddress', 'setAddressToStore']),

    expressPaymentsLoad() {
      this.$emit('expressPaymentsLoad', 'true');
      this.paypalLoaded = true;
    },

    async setShippingInformation(payload) {
      const adddress = this.mapAddress(payload.details.shippingAddress, payload.details.email, payload.details.phone);
      this.setAddressToStore(adddress, 'shipping');

      await this.submitShippingInfo();

      return payload;
    },

    getPaymentData(payload) {
      const additionalPaymentData = getAdditionalPaymentData();
      const { details } = payload;

      return {
        billingAddress: this.mapAddress(
          details.billingAddress,
          details.email,
          details.phone,
          details.firstName,
          details.lastName,
        ),
        email: details.email,
        paymentMethod: {
          method: 'braintree_paypal',
          additional_data: {
            payment_method_nonce: payload.nonce,
            ...additionalPaymentData,
          },
          extension_attributes: getPaymentExtensionAttributes(),
        },
      };
    },

    mapAddress(address, email, telephone, billingFirstname, billingLastname) {
      const [firstname, ...lastname] = address.recipientName ? address.recipientName.split(' ') : [];
      return {
        street: [
          address.line1,
          address.line2,
          address.line3,
        ],
        postcode: address.postalCode,
        country_code: address.countryCode,
        email,
        firstname: billingFirstname || firstname,
        lastname: billingLastname || (lastname.length ? lastname.join(' ') : 'UNKNOWN'),
        city: address.city,
        telephone,
        region: address.state,
        region_id: this.getRegionId(address.countryCode, address.state),
      };
    },

    redirectToSuccess() {
      window.location.href = getSuccessPageUrl();
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
