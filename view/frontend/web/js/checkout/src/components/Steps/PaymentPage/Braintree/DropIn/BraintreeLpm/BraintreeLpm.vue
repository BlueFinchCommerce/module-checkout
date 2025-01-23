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
        data-cy="braintree-lpm-trigger"
        @click="selectMethod"
        @keydown="selectMethod"
      >
        <div
          class="braintree-option braintree-option__lpm"
          :class="{'braintree-option__selected': isMethodSelected}"
          tabindex="0"
          role="button"
        >
          <div class="braintree-option__logo">
            <svg
              width="48"
              height="29"
              class=""
            >
              <use xlink:href="#logoLpm"
                data-cy="braintree-lpm-logo"
              />
            </svg>
          </div>
          <div
            class="braintree-option__label"
            :aria-label="$t('braintree.payingWith', { paymentTitle: getPaymentMethodTitle('braintree_local_payment') })"
            data-cy="braintree-lpm-title"
          >
            {{ getPaymentMethodTitle('braintree_local_payment') }}
            <div class="braintree-option__disabled-message" />
          </div>
        </div>
      </div>
      <div
        v-show="isMethodSelected"
        class="braintree-lpm-container"
      >
        <template v-if="getFilteredLpmMethods?.length">
          <ErrorMessage
            v-if="errorMessage"
            :message="errorMessage"
            :attached="false"
          />
          <Agreements id="braintreeLpm" />
          <PrivacyPolicy />
          <Recaptcha
            v-if="getTypeByPlacement('braintree')"
            id="braintree"
            location="braintreeLpm"
          />
          <button
            v-for="allowedMethod in getFilteredLpmMethods"
            v-show="!loading"
            :key="allowedMethod"
            class="button button--secondary braintree-lpm-method"
            :data-cy="'braintree-lpm-pay-button'"
            @click="initialiseLpm(allowedMethod)"
          >
            <img
              data-cy="braintree-lpm-button-image"
              :src="getIcon(allowedMethod)"
              :alt="allowedMethod"
            >
          </button>
        </template>
        <TextField
          v-else
          :text="$t('braintree.lpm.noMethods')"
          data-cy="braintree-lpm-no-method-text"
        />
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
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

// Components
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// Helpers
import getAdditionalPaymentData from '@/helpers/payment/getAdditionalPaymentData';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import recapchaTypes from '@/helpers/types/getRecaptchaTypes';

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
    ErrorMessage,
    PrivacyPolicy,
    Recaptcha,
    TextField,
  },
  data() {
    return {
      loading: false,
      isMethodSelected: false,
      lpmLocation: null,
    };
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'merchantAccountId',
      'clientInstance',
      'lpm',
      'getFilteredLpmMethods',
      'errorMessage',
    ]),
    ...mapState(useConfigStore, ['currencyCode']),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
    ...mapState(useCustomerStore, ['customer', 'selected', 'getSelectedBillingAddress']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'getPaymentPriority', 'selectedMethod']),
    ...mapState(useRecaptchaStore, ['getTypeByPlacement']),
  },
  async created() {
    await this.getInitialConfig();
    await this.createClientToken();

    this.paymentEmitter.on('braintreePaymentStart', () => { this.loading = true; });
    this.paymentEmitter.on('braintreePaymentError', () => { this.loading = false; });
    this.paymentEmitter.on('braintreeInitComplete', () => { this.lpmLocation = '.braintree-sheet__container'; });
  },
  watch: {
    selectedMethod: {
      handler(newVal) {
        if (newVal !== null && newVal !== 'braintree-lpm') {
          this.isMethodSelected = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useBraintreeStore, [
      'createClientToken',
      'setErrorMessage',
      'clearErrorMessage',
    ]),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(usePaymentStore, ['getPaymentMethodTitle']),
    ...mapActions(useRecaptchaStore, ['validateToken']),
    ...mapActions(usePaymentStore, ['selectPaymentMethod']),

    getIcon(method) {
      return getStaticUrl(images[method]);
    },

    async selectMethod() {
      this.isMethodSelected = true;
      this.selectPaymentMethod('braintree-lpm');
      if (this.getTypeByPlacement('braintree') === recapchaTypes.invisible) {
        await this.validateToken('braintree', 'braintreeLpm');
      }
    },

    async initialiseLpm(allowedMethod) {
      this.clearErrorMessage();
      this.paymentEmitter.emit('braintreePaymentStart');

      if (!this.validateAgreements()) {
        this.paymentEmitter.emit('braintreePaymentError');
        return;
      }

      if (this.getTypeByPlacement('braintree') !== recapchaTypes.invisible) {
        if (!await this.validateToken('braintree', 'braintreeLpm')) {
          this.paymentEmitter.emit('braintreePaymentError');
          return;
        }
      }

      const lpmInstance = await braintree.localPayment.create({
        client: this.clientInstance,
        merchantAccountId: this.merchantAccountId,
      });
      const isVirtual = this.cart.is_virtual;

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
        paymentTypeCountryCode: billingAddress.country_code,
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
