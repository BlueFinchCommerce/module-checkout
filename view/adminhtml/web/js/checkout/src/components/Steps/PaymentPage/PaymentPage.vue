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
          <ErrorMessage
            v-if="rvvupErrorMessage !== ''"
            :message="rvvupErrorMessage"
          />
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
            <AdyenPaymentMethods
              v-if="adyenVaultEnabled"
              id="adyen-dropin-container-stored"
              :key="`adyenStoredMethods-${paymentKey}`"
              :stored-payments="true"
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
          <AdyenDropIn
            v-if="isAdyenAvailable"
            :key="`adyenNewMethods-${paymentKey}`"
          />
          <BraintreeDropIn :key="`braintreeNewMethods-${paymentKey}`" />
          <RvvupPayByBank
            v-if="rvvupPaymentsActive"
            :key="`rvvupNewMethods-${paymentKey}`"
          />
          <div v-if="isPaymentMethodAvailable('checkmo')">
            <FreeMOCheckPayment
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
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

// Components
import SavedDeliveryAddress from
  '@/components/Steps/CustomerInfoPage/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
import AdyenDropIn from '@/components/Steps/PaymentPage/Adyen/DropIn/DropIn.vue';
import AdyenPaymentMethods from '@/components/Steps/PaymentPage/Adyen/DropIn/PaymentMethods/PaymentMethods.vue';
import BraintreeDropIn from '@/components/Steps/PaymentPage/Braintree/DropIn/DropIn.vue';
import SavedShippingMethod
  from '@/components/Steps/PaymentPage/SavedShippingMethod/SavedShippingMethod.vue';
import Rewards from '@/components/Core/ContentComponents/Rewards/Rewards.vue';
import StoreCredit from '@/components/Steps/PaymentPage/StoreCredit/StoreCredit.vue';
import FreeMOCheckPayment from '@/components/Steps/PaymentPage/FreeMOCheckPayment/FreeMOCheckPayment.vue';
import RvvupPayByBank from '@/components/Steps/PaymentPage/Rvvup/PayByBank/PayByBank.vue';
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
    AdyenDropIn,
    AdyenPaymentMethods,
    Rewards,
    FreeMOCheckPayment,
    RvvupPayByBank,
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
      paymentStepTextStoredId: 'gene-bettercheckout-paymentstep-text-stored',
      paymentStepTextNewId: 'gene-bettercheckout-paymentstep-text-new',
      paymentStepTextGuestId: 'gene-bettercheckout-paymentstep-text-guest',
    };
  },
  computed: {
    ...mapState(useConfigStore, [
      'currencyCode',
      'storeCode',
      'rewardsEnabled',
      'rvvupPaymentsActive',
    ]),
    ...mapState(useCustomerStore, ['isLoggedIn']),
    ...mapState(useAdyenStore, ['adyenVaultEnabled', 'isAdyenAvailable']),
    ...mapState(usePaymentStore, [
      'paymentEmitter',
      'hasVaultedMethods',
      'isPaymentMethodAvailable',
      'getPaymentMethodTitle',
      'rvvupErrorMessage',
    ]),
    ...mapState(useCartStore, ['cart', 'cartEmitter', 'cartGrandTotal']),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),
  },
  async created() {
    // The titles need to be reflective of the state we're in.
    this.storedStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    if (this.hasVaultedMethods) {
      this.paymentStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-new']
        || this.$t('paymentStep.titleNew');
    } else {
      this.paymentStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-guest']
          || this.$t('paymentStep.titleGuest');
    }

    document.addEventListener(this.paymentStepTextStoredId, this.setPaymentStepText);
    document.addEventListener(this.paymentStepTextNewId, this.setPaymentStepText);
    document.addEventListener(this.paymentStepTextGuestId, this.setPaymentStepText);

    this.additionalPaymentMethods = Object.keys(paymentMethods());
  },
  methods: {
    ...mapActions(useAdyenStore, ['getIsAdyenAvailable']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig', 'getRvvupConfig']),
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
<style lang="scss" scoped>
@import "./styles";
</style>
