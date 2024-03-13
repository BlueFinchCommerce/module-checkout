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
import useBraintreeStore from '@/stores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStore';

// Helpers
import getAdditionalPaymentData from '@/helpers/getAdditionalPaymentData';
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';
import getStaticUrl from '@/helpers/getStaticPath';

// Services
import createPayment from '@/services/createPayment';
import refreshCustomerData from '@/services/refreshCustomerData';

// Images
import images from '@/components/Braintree/DropIn/BraintreeLpm/icons';

// External
import braintree from 'braintree-web';

export default {
  name: 'BraintreeLpm',
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
    ...mapState(useCartStore, ['cartGrandTotal', 'isItemRequiringDelivery']),
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
    ...mapActions(useBraintreeStore, [
      'getBraintreeConfig',
      'createClientToken',
      'setErrorMessage',
      'clearErrorMessage',
    ]),
    ...mapActions(useConfigStore, ['getStoreConfig']),
    ...mapActions(useCustomerStore, ['subscribeToNewsletter']),
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

      const lpmInstance = await braintree.localPayment.create({
        client: this.clientInstance,
        merchantAccountId: this.merchantAccountId,
      });
      const isVirtual = !this.isItemRequiringDelivery;

      const address = {
        countryCode: this.selected.shipping.country_code,
      };

      if (!isVirtual) {
        const [streetAddress, extendedAddress] = this.selected.shipping.street;
        address.streetAddress = streetAddress;
        address.extendedAddress = extendedAddress;
        address.locality = this.selected.shipping.city;
        address.postalCode = this.selected.shipping.postcode;
        address.region = this.selected.shipping.region.region;
      }

      const paymentOptions = {
        amount: (this.cartGrandTotal / 100).toString(),
        currencyCode: this.currencyCode,
        email: this.selected.billing.email,
        phone: this.selected.billing.telephone,
        givenName: this.selected.billing.firstname,
        surname: this.selected.billing.lastname,
        shippingAddressRequired: !isVirtual,
        address,
        paymentType: allowedMethod,
        onPaymentStart(data, start) {
          start();
        },
        fallback: {
          url: this.lpm.redirectOnFail,
          buttonText: 'N/A',
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
        .then(this.subscribeToNewsletter)
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
        billingAddress: this.getSelectedBillingAddress,
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
@import "@/components/Braintree/DropIn/BraintreeLpm/styles.scss";
</style>
