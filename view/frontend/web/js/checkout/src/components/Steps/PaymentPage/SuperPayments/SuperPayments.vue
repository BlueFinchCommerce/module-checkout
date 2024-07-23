<template>
  <div>
    <div
      v-if="paymentVisible"
      :class="{active: isMethodSelected}"
      class="super-payments-container"
    >
      <div class="super-payments-title"
           @click="selectPaymentMethod"
           @keydown="selectPaymentMethod">
        <RadioButton
          id="super-payments-select"
          :text="title"
          :checked="isMethodSelected"
          :data-cy="'super-payment-radio'"
          class="super-payment-radio"
          @click="selectPaymentMethod"
          @keydown="selectPaymentMethod"
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

// Stores
import {mapActions, mapState} from 'pinia';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

// Services
import createPayment from '@/services/payments/createPaymentGraphQl';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

//Helpers
import getSuperPaymentsData from '@/helpers/payment/getSuperPaymentsData';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';

//Components
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import RadioButton from '@/components/Core/ActionComponents/Inputs/RadioButton/RadioButton.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import Price from '@/components/Core/ContentComponents/Price/Price.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

//Icons
import superPaymentsSvg from '@/icons/superPaymentsSvg.svg';
import useCartStore from "@/stores/CartStore";

export default {
  name: 'SuperPayments',
  components: {
    ErrorMessage,
    MyButton,
    PrivacyPolicy,
    RadioButton,
    Recaptcha,
    Price,
    TextField
  },
  data: function () {
    return {
      offerBlock: null,
      contentBlock: null,
      buttonDisabled: false,
      isMethodSelected: true,
      paymentVisible: true,
      errorMessage: '',
    };
  },
  computed: {
    ...mapState(usePaymentStore, ['paymentEmitter', 'isPaymentMethodAvailable']),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),
    ...mapState(useCartStore, ['cartGrandTotal']),

    getSuperPaymentsIcon() {
      return `${getStaticUrl(superPaymentsSvg)}`;
    },
  },
  created() {
    const paymentCode = 'super_payment_gateway';
    this.paymentEmitter.emit('paymentMethodSelected', { paymentCode });

    this.paymentEmitter.on('changePaymentMethodDisplay', ({visible}) => {
      this.paymentVisible = visible;
    });

    this.paymentEmitter.on('paymentMethodSelected', ({id}) => {
      if (id !== 'super_payment_gateway') {
        this.isMethodSelected = false;
      }
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

    async selectPaymentMethod() {
      this.isMethodSelected = true;

      this.paymentEmitter.emit('paymentMethodSelected', {
        id: 'super_payment_gateway',
        type: 'super_payment_gateway',
      });
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
      window.location.href = getBaseUrl() + '/superpayment/payment/redirect';
    }
  },
}
</script>


<style lang="scss" scoped>
@import "./styles.scss";
</style>
