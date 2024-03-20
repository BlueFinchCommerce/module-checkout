<template>
  <teleport
    v-if="lpmLocation"
    :to="lpmLocation"
  >
    <div
      v-if="!loading && clientInstance"
      class="braintree-form braintree-sheet"
      :style="{
        '--braintree-method-position': getPaymentPriority('braintree_local_payment') + 1
      }"
    >
      <div
        data-braintree-id="lpm"
        class="braintree-lpm braintree-sheet"
        @click="selectMethod"
        @keydown="selectMethod"
      >
        <div
          class="braintree-option braintree-option__lpm"
          :class="{'braintree-option__selected': selectedMethod === 'braintree-lpm'}"
          tabindex="0"
          role="button"
        >
          <div class="braintree-option__logo">
            <svg
              width="48"
              height="29"
              class=""
            >
              <use xlink:href="#logoLpm" />
            </svg>
          </div>
          <div
            class="braintree-option__label"
            :aria-label="$t('braintree.payingWith', { paymentTitle: getPaymentMethodTitle('braintree_local_payment') })"
          >
            {{ getPaymentMethodTitle('braintree_local_payment') }}
            <div class="braintree-option__disabled-message" />
          </div>
        </div>
      </div>
      <div
        v-show="selectedMethod === 'braintree-lpm'"
        class="braintree-lpm-container"
      >
        <Agreements id="braintreeLpm" />
        <PrivacyPolicy />
        <button
          v-for="allowedMethod in lpm.allowedMethods"
          v-show="!loading"
          :key="allowedMethod"
          class="button button--secondary braintree-lpm-method"
          @click="initialiseLpm(allowedMethod)"
        >
          <img
            :src="getIcon(allowedMethod)"
            :alt="allowedMethod"
          >
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

// Components
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';

// Helpers
import getAdditionalPaymentData from '@/helpers/payment/getAdditionalPaymentData';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

// Services
import createPayment from '@/services/payments/createPaymentRest';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// Images
import images from '@/components/Steps/PaymentPage/Braintree/DropIn/BraintreeLpm/icons';

// External
import braintree from 'braintree-web';

export default {
  name: 'BraintreeLpm',
  components: {
    Agreements,
    PrivacyPolicy,
  },
  data() {
    return {
      loading: false,
      selectedMethod: null,
      lpmLocation: null,
    };
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'merchantAccountId',
      'clientInstance',
      'lpm',
    ]),
    ...mapState(useConfigStore, ['currencyCode']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal', 'isItemRequiringDelivery']),
    ...mapState(useCustomerStore, ['customer', 'selected', 'getSelectedBillingAddress']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'getPaymentPriority']),
  },
  async created() {
    await this.getStoreConfig();
    await this.getPaymentMethods();
    await this.getBraintreeConfig();
    await this.createClientToken();

    this.paymentEmitter.on('braintreePaymentStart', () => { this.loading = true; });
    this.paymentEmitter.on('braintreePaymentError', () => { this.loading = false; });
    this.paymentEmitter.on('braintreeInitComplete', () => { this.lpmLocation = '.braintree-sheet__container'; });
    this.paymentEmitter.on('paymentMethodSelected', ({ id }) => {
      this.selectedMethod = id;
    });
  },

  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, [
      'getBraintreeConfig',
      'createClientToken',
      'setErrorMessage',
      'clearErrorMessage',
    ]),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(usePaymentStore, ['getPaymentMethods', 'getPaymentMethodTitle']),

    getIcon(method) {
      return getStaticUrl(images[method]);
    },

    selectMethod() {
      this.paymentEmitter.emit('paymentMethodSelected', { id: 'braintree-lpm' });
    },

    async initialiseLpm(allowedMethod) {
      this.clearErrorMessage();
      this.paymentEmitter.emit('braintreePaymentStart');

      if (!this.validateAgreements()) {
        this.paymentEmitter.emit('braintreePaymentError');
        return;
      }

      const lpmInstance = await braintree.localPayment.create({
        client: this.clientInstance,
        merchantAccountId: this.merchantAccountId,
      });
      const isVirtual = !this.isItemRequiringDelivery;

      const shippingAddress = this.cart.shipping_addresses[0];
      const address = {};

      address.countryCode = shippingAddress.country.code;

      if (!isVirtual) {
        const [streetAddress, extendedAddress] = shippingAddress.street;
        address.streetAddress = streetAddress;
        address.extendedAddress = extendedAddress;
        address.locality = shippingAddress.city;
        address.postalCode = shippingAddress.postcode;
        address.region = shippingAddress.region.code;
      }

      const billingAddress = this.cart.billing_address;

      const paymentOptions = {
        amount: (this.cartGrandTotal / 100).toString(),
        currencyCode: this.currencyCode,
        email: this.cart.email,
        phone: billingAddress.telephone,
        givenName: billingAddress.firstname,
        surname: billingAddress.lastname,
        shippingAddressRequired: !isVirtual,
        address,
        paymentType: allowedMethod,
        paymentTypeCountryCode: billingAddress.country.code,
        recurrent: false,
        customerId: null,
        onPaymentStart(data, start) {
          start();
        },
        fallback: {
          url: 'N/A',
          buttonText: 'N/A',
          cancelButtonText: 'N/A',
          cancelUrl: 'https://google.com',
        },
      };

      lpmInstance.startPayment(paymentOptions, this.paymentCallback);
    },

    paymentCallback(paymentError, payload) {
      if (paymentError) {
        switch (paymentError.code) {
          case 'LOCAL_PAYMENT_POPUP_CLOSED':
            this.setErrorMessage(this.$t('Local Payment popup was closed unexpectedly.'));
            break;
          case 'LOCAL_PAYMENT_WINDOW_OPEN_FAILED':
            this.setErrorMessage(this.$t('Local Payment popup failed to open.'));
            break;
          case 'LOCAL_PAYMENT_WINDOW_CLOSED':
            this.setErrorMessage(this.$t('Local Payment popup was closed. Payment cancelled.'));
            break;
          case 'LOCAL_PAYMENT_INVALID_PAYMENT_OPTION':
            this.setErrorMessage(this.$t('Local payment options are invalid.'));
            break;
          case 'LOCAL_PAYMENT_CANCELED':
            this.setErrorMessage(this.$t('Local payment was cancelled.'));
            break;
          default:
            this.setErrorMessage(paymentError.message);
            break;
        }

        this.paymentEmitter.emit('braintreePaymentError');
        return;
      }

      const paymentData = this.getPaymentData(payload);

      createPayment(paymentData)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuccess)
        .catch((error) => {
          const message = error?.response?.data?.message || error.message;
          this.setErrorMessage(message);
          this.paymentEmitter.emit('braintreePaymentError');
        });
    },

    getPaymentData(payload) {
      const additionalPaymentData = getAdditionalPaymentData();

      return {
        email: this.customer.email,
        paymentMethod: {
          method: 'braintree_local_payment',
          additional_data: {
            payment_method_nonce: payload.nonce,
            ...additionalPaymentData,
          },
          extension_attributes: getPaymentExtensionAttributes(),
        },
      };
    },

    redirectToSuccess() {
      window.location.href = getSuccessPageUrl();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Steps/PaymentPage/Braintree/DropIn/BraintreeLpm/styles.scss";
</style>
