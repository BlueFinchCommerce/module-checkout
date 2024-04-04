<template>
  <div
    v-if="paymentVisible"
    class="free-payment"
    :class="{active: isMethodSelected}"
  >
    <RadioButton
      :text="title"
      :checked="isMethodSelected"
      class="free-payment-radio"
      @click="selectPaymentMethod"
      @keydown="selectPaymentMethod"
    />
    <ErrorMessage
      v-if="errorMessage && isMethodSelected"
      :message="errorMessage"
      :attached="false"
    />
    <Recaptcha
      v-if="isMethodSelected"
      id="placeOrder"
      location="freeMoCheckPayment"
    />
    <Agreements
      v-if="isMethodSelected"
      id="freeMoPayment"
    />
    <PrivacyPolicy v-if="isMethodSelected" />
    <MyButton
      v-if="isMethodSelected"
      class="free-payment-button"
      :label="$t('paymentStep.payNow')"
      primary
      :disabled="buttonDisabled"
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
      buttonDisabled: false,
      isMethodSelected: false,
      paymentVisible: true,
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['paymentEmitter', 'isPaymentMethodAvailable']),
    ...mapState(useCustomerStore, [
      'customer',
    ]),
  },
  created() {
    this.paymentEmitter.on('paymentMethodSelected', ({ id }) => {
      if (id !== this.paymentType) {
        this.isMethodSelected = false;
      }
    });

    this.paymentEmitter.on('changePaymentMethodDisplay', ({ visible }) => {
      this.paymentVisible = visible;
    });
  },
  methods: {
    ...mapActions(useAgreementStore, ['validateAgreements']),

    async selectPaymentMethod() {
      this.isMethodSelected = true;

      this.paymentEmitter.emit('paymentMethodSelected', {
        id: this.paymentType,
        type: this.paymentType,
      });
    },
    createPayment() {
      const paymentMethod = {
        code: this.paymentType,
      };
      this.buttonDisabled = true;

      // Check that the agreements (if any) are valid.
      const isValid = this.validateAgreements();

      if (!isValid) {
        this.buttonDisabled = false;
        return;
      }

      createPayment(paymentMethod)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuccess)
        .catch((error) => {
          if (error.message) {
            this.errorMessage = error.message;
          }
          this.buttonDisabled = false;
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
