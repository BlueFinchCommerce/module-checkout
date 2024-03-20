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

import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import handleServiceError from '@/helpers/validation/handleServiceError';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';

import createPayment from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setBillingAddressOnCart from '@/services/addresses/setBillingAddressOnCart';
import setShippingAddressesOnCart from '@/services/addresses/setShippingAddressesOnCart';

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
            amount: this.cartGrandTotal / 100,
            flow: 'checkout',
            currency: this.currencyCode,
            enableShippingAddress: true,
            intent: 'capture',
            lineItems: this.getPayPalLineItems(),
            shippingOptions: [],
          }),
          onClick: () => {
            // Check that the agreements (if any) are valid.
            const isValid = this.validateAgreements();

            if (!isValid) {
              return false;
            }

            return true;
          },
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

            await this.submitShippingInfo(selectedShipping.carrier_code, selectedShipping.method_code);

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

            const amount = this.cartGrandTotal / 100;

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
            .then(this.setInformationToQuote)
            .then(this.makePayment)
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
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, ['getBraintreeConfig', 'createClientToken', 'getPayPalLineItems']),
    ...mapActions(useShippingMethodsStore, ['submitShippingInfo']),
    ...mapActions(usePaymentStore, ['getPaymentMethods', 'setErrorMessage']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['submitEmail']),

    expressPaymentsLoad() {
      this.$emit('expressPaymentsLoad', 'true');
      this.paypalLoaded = true;
    },

    setInformationToQuote(payload) {
      const shippingAddress = this.mapAddress(
        payload.details.shippingAddress,
        payload.details.email,
        payload.details.phone,
      );
      const billingAddress = this.mapAddress(
        payload.details.billingAddress,
        payload.details.email,
        payload.details.phone,
        payload.details.firstName,
        payload.details.lastName,
      );

      return Promise.all([
        this.submitEmail(payload.details.email).then(() => ({ payload, email: payload.details.email })),
        setBillingAddressOnCart(billingAddress),
        setShippingAddressesOnCart(shippingAddress),
      ]);
    },

    makePayment([{ payload, email }]) {
      const payment = {
        email,
        paymentMethod: {
          method: 'braintree_paypal',
          additional_data: {
            payment_method_nonce: payload.nonce,
          },
          extension_attributes: getPaymentExtensionAttributes(),
        },
      };

      return createPayment(payment);
    },

    mapAddress(address, email, telephone, billingFirstname, billingLastname) {
      const [firstname, ...lastname] = address.recipientName ? address.recipientName.split(' ') : [];
      return {
        street: [
          address.line1,
          address.line2 || '',
        ],
        postcode: address.postalCode,
        country_code: address.countryCode,
        company: address.company || '',
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
