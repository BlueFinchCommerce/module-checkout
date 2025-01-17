<template>
  <div
    v-if="paymentVisible"
    class="free-payment"
    :class="{active: isMethodSelected}"
  >
    <RadioButton
      id="fastlane-select"
      :text="title"
      :checked="isMethodSelected"
      :data-cy="'free-mo-payment-radio'"
      class="free-payment-radio"
      @click="selectCheckMoPaymentMethod"
      @keydown="selectCheckMoPaymentMethod"
    />
    <ErrorMessage
      v-if="errorMessage && isMethodSelected"
      :message="errorMessage"
      :attached="false"
    />
    <Agreements
      v-if="isMethodSelected"
      id="freeMoPayment"
    />
    <PrivacyPolicy v-if="isMethodSelected" />
    <Recaptcha
      v-if="isMethodSelected &&  (getTypeByPlacement('placeOrder') || getTypeByPlacement('braintree'))"
      :id="getTypeByPlacement('placeOrder') ? 'placeOrder' : 'braintree'"
      location="freeMoCheckPayment"
    />
    <MyButton
      v-if="isMethodSelected"
      class="free-payment-button"
      :label="$t('paymentStep.payNow')"
      primary
      :data-cy="'free-mo-pay-button'"
      @click="createPayment()"
    />
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import useLoadingStore from '@/stores/LoadingStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';

// Components
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import RadioButton from '@/components/Core/ActionComponents/Inputs/RadioButton/RadioButton.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';

// Services
import createPayment from '@/services/payments/createPaymentGraphQl';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// Helpers
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';

export default {
  name: 'FreePayment',
  components: {
    Agreements,
    ErrorMessage,
    MyButton,
    PrivacyPolicy,
    RadioButton,
    Recaptcha,
  },
  props: {
    paymentType: String,
    title: String,
  },
  data() {
    return {
      isMethodSelected: false,
      paymentVisible: true,
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['paymentEmitter', 'isPaymentMethodAvailable', 'selectedMethod']),
    ...mapState(useCustomerStore, [
      'customer',
    ]),
    ...mapState(useRecaptchaStore, ['getTypeByPlacement']),
    ...mapState(useBraintreeStore, ['isBraintreeEnabled']),
  },
  watch: {
    selectedMethod: {
      handler(newVal) {
        if (newVal !== null && newVal !== this.paymentType) {
          this.isMethodSelected = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.paymentEmitter.on('changePaymentMethodDisplay', ({ visible }) => {
      this.paymentVisible = visible;
    });
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),
    ...mapActions(useRecaptchaStore, ['validateToken']),
    ...mapActions(usePaymentStore, ['selectPaymentMethod']),
    ...mapActions(useLoadingStore, ['setLoadingState']),

    selectCheckMoPaymentMethod() {
      this.isMethodSelected = true;
      this.selectPaymentMethod(this.paymentType);
    },
    async createPayment() {
      const paymentMethod = {
        code: this.paymentType,
      };
      // Check that the agreements (if any) and recpatcha is valid.
      const agreementsValid = this.validateAgreements();
      let recaptchaValid;

      if (this.isBraintreeEnabled) {
        recaptchaValid = await this.validateToken('braintree', 'freeMoCheckPayment');
      } else {
        recaptchaValid = await this.validateToken('placeOrder', 'freeMoCheckPayment');
      }

      if (!agreementsValid || !recaptchaValid) {
        return;
      }

      this.setLoadingState(true);

      createPayment(paymentMethod)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuccess)
        .catch((error) => {
          if (error.message) {
            this.errorMessage = error.message;
          }
          this.setLoadingState(false);
        });
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
