<template>
  <div
    :id="`braintree-paypal-${namespace}`"
    ref="braintreePayPal"
    :class="!paypalLoaded ? 'text-loading' : ''"
    :data-cy="'instant-checkout-braintreePayPal'"
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
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import handleServiceError from '@/helpers/validation/handleServiceError';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';

import createPayment from '@/services/payments/createPaymentRest';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';

// Extensions
import functionExtension from '@/extensions/functionExtension';

export default {
  name: 'BraintreePayPal',
  data() {
    return {
      googlePayNoShippingMethods: '',
      instance: null,
      googleClient: null,
      paypalInstance: null,
      paypalLoaded: false,
      key: 'braintreePayPal',
      namespace: 'paypal',
      method: 'braintree_paypal',
    };
  },
  props: {
    isCredit: {
      type: Boolean,
    },
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
      'paypalCreditThresholdEnabled',
      'paypalCreditThresholdValue',
    ]),
    ...mapState(usePaymentStore, ['availableMethods', 'isPaymentMethodAvailable']),
  },
  async created() {
    this.addExpressMethod(this.key);
    await this.getInitialConfig();
    await this.getCart();

    const paypalConfig = this.availableMethods.find((method) => (
      method.code === this.method
    ));

    if (!paypalConfig) {
      // Early return if Braintree PayPal isn't enabled.
      this.paypalLoaded = true;
      this.removeExpressMethod(this.key);
      return;
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
        this.removeExpressMethod(this.key);
        return;
      }

      this.paypalInstance = markRaw(paypalInstance);

      const total = (this.cartGrandTotal / 100);

      this.namespace = `${this.namespace}`;

      if (this.isCredit) {
        if (this.paypalCreditThresholdEnabled
          && total >= Number(this.paypalCreditThresholdValue)) {
          this.namespace = `${this.namespace}_credit`;
        } else {
          this.namespace = `${this.namespace}_credit`;
        }
      }

      const sdkConfig = {
        components: 'buttons,funding-eligibility',
        currency: this.currencyCode,
        intent: 'capture',
        vault: 'false',
        dataAttributes: {
          namespace: this.namespace,
        },
      };

      if (this.isCredit) {
        if (this.paypalCreditThresholdEnabled
          && total >= Number(this.paypalCreditThresholdValue)) {
          sdkConfig['enable-funding'] = 'credit';
        } else {
          sdkConfig['enable-funding'] = 'credit';
        }
      }

      if (this.environment === 'sandbox') {
        sdkConfig['buyer-country'] = this.paypal.merchantCountry;
      }

      paypalInstance.loadPayPalSDK(sdkConfig, () => {
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
          fundingSource: this.isCredit ? window[this.namespace].FUNDING.CREDIT : window[this.namespace].FUNDING.PAYPAL,
          createOrder: () => paypalInstance.createPayment({
            amount: this.cartGrandTotal / 100,
            flow: 'checkout',
            currency: this.currencyCode,
            enableShippingAddress: !this.cart.is_virtual,
            locale: this.locale,
            intent: 'capture',
            lineItems: this.getPayPalLineItems(),
            shippingOptions: [],
          }),
          onClick: async () => {
            this.setErrorMessage('');
            // Check that the agreements (if any) is valid.
            const agreementsValid = this.validateAgreements();

            if (!agreementsValid) {
              return false;
            }

            await functionExtension('onBraintreeExpressInit');
            this.setNotClickAndCollect();

            return true;
          },
          onShippingChange: async (data) => {
            const address = {
              city: data.shipping_address.city,
              company: '',
              country_code: data.shipping_address.country_code,
              postcode: data.shipping_address.postal_code,
              region: data.shipping_address.state,
              region_id: this.getRegionId(data.shipping_address.country_code, data.shipping_address.state),
              street: ['0'],
              telephone: '000000000',
              firstname: 'UNKNOWN',
              lastname: 'UNKNOWN',
            };

            const result = await getShippingMethods(address, this.method, true);
            const methods = result.shipping_addresses[0].available_shipping_methods;

            // Filter out nominated day as this isn't available inside of PayPal.
            const fShippingMethods = methods.filter((sid) => sid.id !== 'nominated_delivery');

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
                // clear shipping address form
                this.createNewAddress('shipping');
                this.setErrorMessage(formattedError);
              }
            }),
          onCancel: () => {
            // clear shipping address form
            this.createNewAddress('shipping');
          },
          onError: (err) => {
            this.setErrorMessage(err);
          },
        };

        // If is PayPalCredit and enabled.
        if (this.paypal.creditActive && this.isCredit) {
          if (this.paypalCreditThresholdEnabled
            && total >= Number(this.paypalCreditThresholdValue)) {
            renderData.fundingSource = window[this.namespace].FUNDING.CREDIT;
            renderData.style.color = this.paypal.creditColor !== 'gold'
            && this.paypal.creditColor !== 'blue'
            && this.paypal.creditColor !== 'silver'
              ? this.paypal.creditColor : 'darkblue';
            renderData.style.label = this.paypal.creditLabel;
            renderData.style.shape = this.paypal.creditShape;
          } else {
            renderData.fundingSource = window[this.namespace].FUNDING.CREDIT;
            renderData.style.color = this.paypal.creditColor !== 'gold'
            && this.paypal.creditColor !== 'blue'
            && this.paypal.creditColor !== 'silver'
              ? this.paypal.creditColor : 'darkblue';
            renderData.style.label = this.paypal.creditLabel;
            renderData.style.shape = this.paypal.creditShape;
          }
        }

        return window[this.namespace].Buttons(renderData).render(`#braintree-paypal-${this.namespace}`)
          .then((response) => {
            this.paypalLoaded = true;

            return response;
          });
      });
    });
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, ['createClientToken', 'getPayPalLineItems']),
    ...mapActions(useShippingMethodsStore, ['submitShippingInfo', 'setNotClickAndCollect']),
    ...mapActions(usePaymentStore, [
      'addExpressMethod',
      'removeExpressMethod',
      'setErrorMessage',
    ]),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, ['submitEmail', 'createNewAddress']),

    setInformationToQuote(payload) {
      const shippingAddress = !this.cart.is_virtual ? this.mapAddress(
        payload.details.shippingAddress,
        payload.details.email,
        payload.details.phone,
      ) : null;
      const billingAddress = this.mapAddress(
        payload.details.billingAddress,
        payload.details.email,
        payload.details.phone,
        payload.details.firstName,
        payload.details.lastName,
      );

      // If billingAddress is missing fields, use values from shippingAddress
      // added in case if billing address not required on braintree account
      if (billingAddress) {
        if (!billingAddress.city && shippingAddress?.city) {
          billingAddress.city = shippingAddress.city;
        }
        if (!billingAddress.postcode && shippingAddress?.postcode) {
          billingAddress.postcode = shippingAddress.postcode;
        }
        if (!billingAddress.street[0] && shippingAddress?.street[0]) {
          [billingAddress.street[0]] = shippingAddress.street;
        }
      }

      return setAddressesOnCart(shippingAddress, billingAddress, payload.details.email)
        .then(() => ({ payload, email: payload.details.email }));
    },

    makePayment({ payload, email }) {
      const payment = {
        email,
        paymentMethod: {
          method: this.method,
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
      const regionId = this.getRegionId(address.countryCode, address.state);
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
        telephone: telephone !== undefined ? telephone : '000000000',
        region: {
          ...(address.state ? { region: address.state } : {}),
          ...(regionId ? { region_id: regionId } : {}),
        },
      };
    },

    redirectToSuccess() {
      window.location.href = getSuccessPageUrl();
    },
  },
  unmounted() {
    if (this.instance
      && !this.isPaymentMethodAvailable('braintree_googlepay')) {
      this.instance.teardown();
    }

    if (this.paypalInstance) {
      this.paypalInstance.teardown();
    }
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
