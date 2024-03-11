<template>
  <div class="free-payment">
    <RadioButton
      :text="title"
      :checked="isMethodSelected"
      @click="selectPaymentMethod"
      @keydown="selectPaymentMethod"
    />
    <MyButton
      class="free-payment-button"
      :label="$t('paymentStep.payNow')"
      primary
      v-if="isMethodSelected"
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
import usePaymentStore from '@/stores/PaymentStore';

// Components
import MyButton from '@/components/Core/Button/Button.vue';
import RadioButton from '@/components/Core/Inputs/RadioButton/RadioButton.vue';

// Services
import createPayment from '@/services/createPayment';
import refreshCustomerData from '@/services/refreshCustomerData';

// Helpers
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';

export default {
  name: 'FreePayment',
  components: { MyButton, RadioButton },
  props: {
    paymentType: String,
    title: String,
  },
  data() {
    return {
      buttonDisabled: false,
      isMethodSelected: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['cartEmitter']),
    ...mapState(usePaymentStore, ['paymentEmitter', 'isPaymentMethodAvailable']),
    ...mapState(useCustomerStore, [
      'customer',
      'getSelectedBillingAddress',
    ]),
  },
  created() {
    this.paymentEmitter.on('paymentMethodSelected', ({ id }) => {
      if (id !== this.paymentType) {
        this.isMethodSelected = false;
      }
    });

    this.cartEmitter.on('cartUpdated', async () => {
      await this.getCartData();
      await this.getCart();
      await this.getCartTotals();
      await this.getPaymentMethods();
    });
  },
  methods: {
    ...mapActions(useCartStore, ['getCart', 'getCartData', 'getCartTotals']),
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
<style lang="scss" scoped>
@import "./styles.scss";
</style>
