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
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

// Components
import Agreements from '@/components/Core/ContentComponents/Agreements/Agreements.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import PrivacyPolicy from '@/components/Core/ContentComponents/PrivacyPolicy/PrivacyPolicy.vue';
import RadioButton from '@/components/Core/ActionComponents/Inputs/RadioButton/RadioButton.vue';

// Services
import createPayment from '@/services/payments/createPaymentGraphQl';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

// Helpers
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';

export default {
  name: 'FreePayment',
  components: {
    Agreements,
    MyButton,
    PrivacyPolicy,
    RadioButton,
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
    ...mapState(useCartStore, ['cartEmitter']),
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
    ...mapActions(usePaymentStore, ['getPaymentMethods']),
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

      createPayment(paymentMethod)
        .then(() => refreshCustomerData(['cart']))
        .then(this.redirectToSuccess)
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            this.errorMessage = error.response.data.message;
          }
          this.buttonDisabled = false;
          throw Error(error);
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
