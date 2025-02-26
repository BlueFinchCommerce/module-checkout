<template>
  <div class="payment-step">
    <Recaptcha
      v-if="!isRecaptchaVisible('placeOrder')"
      id="placeOrder"
      location="braintreeNewMethods"
    />
    <SavedDeliveryAddress />
    <SavedShippingMethod v-if="!cart.is_virtual" />
    <Rewards v-if="rewardsEnabled" />
    <StoreCredit />
    <div class="payment-page">
      <div class="payment-form">
        <ProgressBar />
        <template v-if="cartGrandTotal">
          <template v-if="isLoggedIn && hasVaultedMethods">
            <div
              class="braintree-payment__title"
            >
              <Payment
                class="braintree-payment__icon"
                fill="black"
              />
              <TextField
                class="braintree-payment__header"
                :text="storedStepText"
              />
              <div class="divider-line" />
            </div>
            <VaultedMethods
              v-if="isPaymentMethodAvailable('braintree_cc_vault')"
              :key="`braintreeStoredMethods-${paymentKey}`"
            />
          </template>

          <div
            class="braintree-payment__title"
          >
            <Payment
              class="braintree-payment__icon"
              fill="black"
            />
            <TextField
              class="braintree-payment__header"
              :text="paymentStepText"
            />
            <div class="divider-line" />
          </div>
          <BraintreeDropIn :key="`braintreeNewMethods-${paymentKey}`" />
          <div v-if="isPaymentMethodAvailable('checkmo')">
            <FreeMOCheckPayment
              :v-if="showMagentoPayments || isBraintreeEnabled !== '0'"
              :payment-type="'checkmo'"
              :title="getPaymentMethodTitle('checkmo')"
            />
          </div>
          <component
            :is="additionalPaymentMethod"
            v-for="additionalPaymentMethod in additionalPaymentMethods"
            :key="additionalPaymentMethod"
          />
        </template>
        <FreeMOCheckPayment
          v-else
          :payment-type="'free'"
          :title="getPaymentMethodTitle('free')
            ? getPaymentMethodTitle('free') : $t('paymentStep.freePaymentLabel')"
        />
      </div>
    </div>
  </div>
</template>
<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

// Components
import SavedDeliveryAddress from
  '@/components/Steps/CustomerInfoPage/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
import BraintreeDropIn from '@/components/Steps/PaymentPage/Braintree/DropIn/DropIn.vue';
import SavedShippingMethod
  from '@/components/Steps/PaymentPage/SavedShippingMethod/SavedShippingMethod.vue';
import Rewards from '@/components/Core/ContentComponents/Rewards/Rewards.vue';
import StoreCredit from '@/components/Steps/PaymentPage/StoreCredit/StoreCredit.vue';
import FreeMOCheckPayment from '@/components/Steps/PaymentPage/FreeMOCheckPayment/FreeMOCheckPayment.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import ProgressBar from '@/components/Steps/GlobalComponents/ProgressBar/ProgressBar.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import VaultedMethods from '@/components/Steps/PaymentPage/Braintree/DropIn/VaultedMethods/VaultedMethods.vue';

// Extensions
import paymentMethods from '@/extensions/paymentMethods';

export default {
  name: 'PaymentPage',
  components: {
    SavedDeliveryAddress,
    SavedShippingMethod,
    Rewards,
    FreeMOCheckPayment,
    ErrorMessage,
    BraintreeDropIn,
    StoreCredit,
    Recaptcha,
    Payment,
    ProgressBar,
    TextField,
    VaultedMethods,
    ...paymentMethods(),
  },
  data() {
    return {
      additionalPaymentMethods: [],
      storedStepText: '',
      paymentStepText: '',
      paymentKey: 0,
      paymentStepTextStoredId: 'bluefinch-checkout-paymentstep-text-stored',
      paymentStepTextNewId: 'bluefinch-checkout-paymentstep-text-new',
      paymentStepTextGuestId: 'bluefinch-checkout-paymentstep-text-guest',
    };
  },
  computed: {
    ...mapState(useConfigStore, [
      'currencyCode',
      'storeCode',
      'rewardsEnabled',
    ]),
    ...mapState(useCustomerStore, ['isLoggedIn']),
    ...mapState(useBraintreeStore, ['isBraintreeEnabled', 'showMagentoPayments']),
    ...mapState(usePaymentStore, [
      'paymentEmitter',
      'hasVaultedMethods',
      'isPaymentMethodAvailable',
      'getPaymentMethodTitle',
    ]),
    ...mapState(useCartStore, ['cart', 'cartEmitter', 'cartGrandTotal']),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),
  },
  async created() {
    // The titles need to be reflective of the state we're in.
    this.storedStepText = window.bluefinchCheckout?.['bluefinch-checkout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    if (this.hasVaultedMethods) {
      this.paymentStepText = window.bluefinchCheckout?.['bluefinch-checkout-paymentstep-text-new']
        || this.$t('paymentStep.titleNew');
    } else {
      this.paymentStepText = window.bluefinchCheckout?.['bluefinch-checkout-paymentstep-text-guest']
          || this.$t('paymentStep.titleGuest');
    }

    document.addEventListener(this.paymentStepTextStoredId, this.setPaymentStepText);
    document.addEventListener(this.paymentStepTextNewId, this.setPaymentStepText);
    document.addEventListener(this.paymentStepTextGuestId, this.setPaymentStepText);

    this.additionalPaymentMethods = Object.keys(paymentMethods());
  },
  methods: {
    ...mapActions(useBraintreeStore, ['getVaultedMethods']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useGtmStore, ['trackStep']),

    setPaymentStepText(event) {
      if (event?.detail?.value) {
        if (event.detail.customEventId === this.paymentStepTextStoredId) {
          this.storedStepText = event.detail.value;
        } else {
          this.paymentStepText = event.detail.value;
        }
        return;
      }

      if (this.hasVaultedMethods) {
        this.storedStepText = this.$t('paymentStep.titleStored');
        this.paymentStepText = this.$t('paymentStep.titleNew');
      } else {
        this.paymentStepText = this.$t('paymentStep.titleGuest');
      }
    },

    setDetailsStepActive() {
      const element = document.getElementById('progress-bar');
      element.classList.add('details-active');
    },
  },
};
</script>
<style lang="scss">
@import "./styles";
</style>
