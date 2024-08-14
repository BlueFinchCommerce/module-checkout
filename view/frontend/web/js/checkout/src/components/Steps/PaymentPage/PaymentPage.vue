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
                :data-cy="'saved-payment-icon'"
              />
              <TextField
                class="braintree-payment__header"
                :text="storedStepText"
                :data-cy="'saved-payment-title'"
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
              :data-cy="'select-payment-method-icon'"
            />
            <TextField
              class="braintree-payment__header"
              :text="getPaymentStepTitle"
              :data-cy="'select-payment-method-title'"
            />
            <div class="divider-line" />
          </div>

          <component
            :is="additionalPaymentMethodPrimary"
            v-for="additionalPaymentMethodPrimary in additionalPaymentMethodsPrimary"
            :key="additionalPaymentMethodPrimary"
          />

          <BraintreeDropIn v-if="isBraintreeEnabled === '1'"
            :key="`braintreeNewMethods-${paymentKey}`" />
          <RvvupPayByBank
            v-if="rvvupPaymentsActive"
            :key="`rvvupNewMethods-${paymentKey}`"
          />
          <div v-if="isPaymentMethodAvailable('checkmo')">
            <FreeMOCheckPayment
              :v-if="showMagentoPayments || isBraintreeEnabled === '1'"
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
import RvvupPayByBank from '@/components/Steps/PaymentPage/Rvvup/PayByBank/PayByBank.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import Recaptcha from '@/components/Steps/PaymentPage/Recaptcha/Recaptcha.vue';
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import ProgressBar from '@/components/Steps/GlobalComponents/ProgressBar/ProgressBar.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import VaultedMethods from '@/components/Steps/PaymentPage/Braintree/DropIn/VaultedMethods/VaultedMethods.vue';

// Helpers
import paymentMethodSelected from '@/helpers/dataLayer/paymentMethodSelectedDataLayer';

// Extensions
import paymentMethods from '@/extensions/paymentMethods';
import paymentMethodsPrimary from '@/extensions/paymentMethodsPrimary';

export default {
  name: 'PaymentPage',
  components: {
    SavedDeliveryAddress,
    SavedShippingMethod,
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
    ...paymentMethodsPrimary(),
  },
  data() {
    return {
      additionalPaymentMethods: [],
      additionalPaymentMethodsPrimary: [],
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
    ...mapState(useBraintreeStore, ['isBraintreeEnabled', 'showMagentoPayments']),
    ...mapState(usePaymentStore, [
      'paymentEmitter',
      'hasVaultedMethods',
      'isPaymentMethodAvailable',
      'getPaymentMethodTitle',
      'rvvupErrorMessage',
    ]),
    ...mapState(useCartStore, ['cart', 'cartEmitter', 'cartGrandTotal']),
    ...mapState(useRecaptchaStore, ['isRecaptchaVisible']),

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
    await this.getVaultedMethods();

    // The titles need to be reflective of the state we're in.
    this.storedStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    await this.getRvvupConfig();

    this.additionalPaymentMethods = Object.keys(paymentMethods());
    this.additionalPaymentMethodsPrimary = Object.keys(paymentMethodsPrimary());

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
    ...mapActions(useBraintreeStore, ['getVaultedMethods']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig', 'getRvvupConfig']),
    ...mapActions(useGtmStore, ['trackStep']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
