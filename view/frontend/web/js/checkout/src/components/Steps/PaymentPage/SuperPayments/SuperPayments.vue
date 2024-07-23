<template>
  <div>
    <div
      v-if="paymentVisible"
      :class="{active: isMethodSelected}"
      class="super-payments-container"
    >
      <div class="super-payments-title"
           @click="selectSuperPaymentMethod"
           @keydown="selectSuperPaymentMethod">
        <RadioButton
          id="super-payments-select"
          :text="title"
          :checked="isMethodSelected"
          :data-cy="'super-payment-radio'"
          class="super-payment-radio"
          @click="selectSuperPaymentMethod"
          @keydown="selectSuperPaymentMethod"
        />
        <span class="payment-method-name">
          {{ $t('superPayments.superPaymentsTitle') }}
        </span>
        <img
          width="45px"
          :src="getSuperPaymentsIcon"
          :alt="$t('superPayments.superPaymentsTitle')"
        >
      </div>
      <ErrorMessage
        v-if="errorMessage && isMethodSelected"
        :message="errorMessage"
        :attached="false"
      />
      <PrivacyPolicy v-if="isMethodSelected"/>
      <Recaptcha
        v-if="isMethodSelected && isRecaptchaVisible('placeOrder')"
        id="placeOrder"
        location="superPayment"
      />
      <div class="superpayment_title"
           v-if="isMethodSelected" v-html="offerBlock"></div>
      <div class="superblockcontent"
           v-if="isMethodSelected" v-html="contentBlock"></div>
      <button v-if="isMethodSelected" :data-cy="'super-payment-button'"
              @click="createPayment()"
              :disabled="buttonDisabled"
              :aria-label="$t('paymentStep.payNow')"
              class="button button--primary button--medium super-payment-button">
        <TextField
          class="super-payment-button-title"
          :text="$t('paymentStep.payNow')"
          :data-cy="'super-payment-button-title'"
        />
        <Price
          v-if="cartGrandTotal !== null"
          class="price"
          :value="cartGrandTotal / 100"
          :data-cy="'super-payment-button-title-total'"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// Services
import createPayment from '@/services/payments/createPaymentGraphQl';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// Helpers
import getSuperPaymentsData from '@/helpers/payment/getSuperPaymentsData';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';

// Components
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import RadioButton from '@/components/Core/ActionComponents/Inputs/RadioButton/RadioButton.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import Price from '@/components/Core/ContentComponents/Price/Price.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// Icons
import superPaymentsSvg from '@/icons/superPaymentsSvg.svg';

export default {
  name: 'SuperPayments',
  components: {
    ErrorMessage,
    PrivacyPolicy,
    RadioButton,
    Recaptcha,
    Price,
    TextField,
  },
  data() {
    return {
      offerBlock: null,
      contentBlock: null,
      buttonDisabled: false,
      isMethodSelected: false,
      paymentVisible: true,
      errorMessage: '',
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['paymentEmitter', 'isPaymentMethodAvailable', 'selectedMethod']),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),
    ...mapState(useCartStore, ['cartGrandTotal']),
    ...mapState(useConfigStore, ['superPaymentsOpen']),

    getSuperPaymentsIcon() {
      return `${getStaticUrl(superPaymentsSvg)}`;
    },
  },
  watch: {
    selectedMethod: {
      handler(newVal) {
        if (newVal !== null && newVal !== 'super_payment_gateway') {
          this.isMethodSelected = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    if (this.superPaymentsOpen) {
      this.selectSuperPaymentMethod();
    }

    this.paymentEmitter.on('changePaymentMethodDisplay', ({ visible }) => {
      this.paymentVisible = visible;
    });

    getSuperPaymentsData()
      .then((response) => {
        this.offerBlock = response.title;
        this.contentBlock = response.description;
      }).catch((error) => {
        this.errorMessage = error;
      });
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useRecaptchaStore, ['validateToken']),
    ...mapActions(usePaymentStore, ['selectPaymentMethod']),

    selectSuperPaymentMethod() {
      this.isMethodSelected = true;
      this.selectPaymentMethod('super_payment_gateway');
    },
    createPayment() {
      const paymentMethod = {
        code: 'super_payment_gateway',
      };
      this.buttonDisabled = true;

      const recaptchaValid = this.validateToken('placeOrder');

      if (!recaptchaValid) {
        return;
      }

      createPayment(paymentMethod)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuperPaymentsPage)
        .catch((error) => {
          if (error.message) {
            this.errorMessage = error.message;
          }
          this.buttonDisabled = false;
        });
    },

    redirectToSuperPaymentsPage() {
      window.location.href = `${getBaseUrl()}/superpayment/payment/redirect`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
