<template>
  <div class="payment-step">
    <ErrorMessage
      v-if="errorMessage"
      :message="errorMessage"
      :attached="false"
      :margin="false"
    />
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
        <component
          :is="ageCheckerExtension"
          v-for="ageCheckerExtension in ageCheckerExtensions"
          :key="ageCheckerExtension"
        />
        <template v-if="cartGrandTotal">
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

            <component
              :is="additionalVaultedMethod"
              v-for="additionalVaultedMethod in additionalVaultedMethods"
              :key="`${additionalVaultedMethod}-${paymentKey}`"
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

          <ErrorMessage
            v-if="paymentErrorMessage"
            :message="paymentErrorMessage"
            :attached="false"
            :margin="false"
          />

          <component
            :is="additionalPaymentMethodPrimary"
            v-for="additionalPaymentMethodPrimary in additionalPaymentMethodsPrimary"
            :key="`${additionalPaymentMethodPrimary}-${paymentKey}`"
          />

          <BraintreeDropIn
            v-if="isBraintreeEnabled === '1'"
            :key="`braintreeNewMethods-${paymentKey}`"
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
            :key="`${additionalPaymentMethod}-${paymentKey}`"
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

// Helpers
import paymentMethodSelected from '@/helpers/dataLayer/paymentMethodSelectedDataLayer';

// Extensions
import additionalVaultedMethods from '@/extensions/additionalVaultedMethods';
import paymentMethods from '@/extensions/paymentMethods';
import paymentMethodsPrimary from '@/extensions/paymentMethodsPrimary';
import ageCheckerExtensions from '@/extensions/ageCheckerExtensions';

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
    ...additionalVaultedMethods(),
    ...paymentMethods(),
    ...paymentMethodsPrimary(),
    ...ageCheckerExtensions(),
  },
  data() {
    return {
      additionalPaymentMethods: [],
      additionalVaultedMethods: [],
      additionalPaymentMethodsPrimary: [],
      ageCheckerExtensions: [],
      storedStepText: '',
      paymentKey: 0,
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
      'paymentErrorMessage',
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

    if (this.isPaymentMethodAvailable('braintree_cc_vault') && this.isLoggedIn) {
      await this.getVaultedMethods();
    }

    this.setPaymentErrorMessage('');

    // The titles need to be reflective of the state we're in.
    this.storedStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    this.additionalPaymentMethods = Object.keys(paymentMethods());
    this.additionalPaymentMethodsPrimary = Object.keys(paymentMethodsPrimary());
    this.additionalVaultedMethods = Object.keys(additionalVaultedMethods());
    this.ageCheckerExtensions = Object.keys(ageCheckerExtensions());

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
    ...mapActions(usePaymentStore, ['setPaymentErrorMessage']),
    ...mapActions(useBraintreeStore, ['getVaultedMethods']),
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useGtmStore, ['trackStep']),
  },
};
</script>
<style lang="scss">
@import "./styles";
</style>
