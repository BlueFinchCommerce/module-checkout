<template>
  <div class="payment-step">
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
              :text="getPaymentStepTitle"
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
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import ProgressBar from '@/components/Steps/GlobalComponents/ProgressBar/ProgressBar.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import VaultedMethods from '@/components/Steps/PaymentPage/Braintree/DropIn/VaultedMethods/VaultedMethods.vue';

// Helpers
import paymentMethodSelected from '@/helpers/dataLayer/paymentMethodSelectedDataLayer';

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
      paymentKey: 0,
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

    getPaymentStepTitle() {
      if (this.hasVaultedMethods) {
        return window.geneCheckout?.['gene-bettercheckout-paymentstep-text-new']
        || this.$t('paymentStep.titleNew');
      }
      return window.geneCheckout?.['gene-bettercheckout-paymentstep-text-guest']
        || this.$t('paymentStep.titleGuest');
    },
  },
  async created() {
    await this.getInitialConfig();
    await this.getCart();

    // The titles need to be reflective of the state we're in.
    this.storedStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    await this.getRvvupConfig();

    this.additionalPaymentMethods = Object.keys(paymentMethods());

    this.trackStep({
      step: 3,
      description: 'payment',
    });

    // Track payment method selection globally.
    this.paymentEmitter.on('paymentMethodSelected', ({ type }) => {
      paymentMethodSelected(type);
    });

    this.cartEmitter.on('cartUpdated', () => {
      this.paymentKey += 1;
    });
  },
  methods: {
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig', 'getRvvupConfig']),
    ...mapActions(useGtmStore, ['trackStep']),
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
