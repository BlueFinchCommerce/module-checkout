<template>
  <section>
    <div class="checkout-section checkout-shipping">
      <ProgressBar />

      <component
        :is="ageCheckerExtension"
        v-for="ageCheckerExtension in ageCheckerExtensions"
        :key="ageCheckerExtension"
      />
      <div class="checkout-shipping-methods">
        <div class="checkout-shipping-methods__title">
          <div class="checkout-shipping-methods__title-icon">
            <Shipping
              fill="black"
              :data-cy="'select-shipping-icon'"
            />
          </div>
          <div class="title">
            <TextField
              class="main-text"
              :text="shippingStepText"
              :data-cy="'select-shipping-title'"
            />
          </div>
          <div class="divider-line" />
        </div>
        <ErrorMessage
          v-if="shippingErrorMessage"
          :message="shippingErrorMessage"
          :attached="false"
        />
        <component
          :is="shippingMethodAdditionalContainer"
          v-for="shippingMethodAdditionalContainer in shippingMethodAdditionalContainers"
          :key="shippingMethodAdditionalContainer"
        />
        <div
          v-if="getShippingMethods && getShippingMethods.length > 0"
          class="shipping-method__container"
        >
          <template
            v-for="(item) in getShippingMethods"
            :key="item.carrier_code"
          >
            <span
              class="shipping-method__label"
              :class="{
                'selected': (
                  item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code
                )
              }"
              @click="handleChange(item)"
              @keydown.enter="handleChange(item)"
            >
              <span class="shipping-method__input">
                <RadioButton
                  :id="item.method_code"
                  :data-cy="`${item.method_code}-radio-input`"
                  :checked="item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code"
                  name="shipping-option"
                />
              </span>
              <span class="shipping-method__content">
                <TextField
                  :text="item.method_title"
                  :data-cy="`${item.method_code}-method-title`"
                />
                <TextField
                  :text="item.carrier_title"
                  :data-cy="`${item.method_code}-carrier-title`"
                />
              </span>
              <TextField
                class="shipping-method__price"
                :text="taxCartDisplayShipping
                  ? formatPrice(item.price_incl_tax.value)
                  : formatPrice(item.price_excl_tax.value)"
                :data-cy="`${item.method_code}-price`"
              />
            </span>
          </template>
          <component
            :is="additionalShippingMethod"
            v-for="additionalShippingMethod in additionalShippingMethods"
            :key="additionalShippingMethod"
          />
        </div>
        <TextField
          v-else-if="!getShippingMethods || getShippingMethods.length === 0"
          class="checkout-shipping-methods__error"
          :text="$t('errorMessages.noShippingMethods')"
          :data-cy="'no-shipping-methods-text'"
        />
        <span
          v-else-if="getError"
          v-html="getError"
        />
      </div>
      <component
        :is="belowShippingMethodsExtension"
        v-for="belowShippingMethodsExtension in belowShippingMethodsExtensions"
        :key="belowShippingMethodsExtension"
      />
      <MyButton
        type="submit"
        primary
        :data-cy="'proceed-to-payment-button'"
        :label="proceedToPayText"
        :disabled="(!getShippingMethods || !getShippingMethods.length
          || !cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code)
          || (typeof ageCheckRequired !== 'undefined' && ageCheckRequired && ageCheckerErrors)"
        @click="goToPayment"
      />
    </div>
  </section>
</template>

<script>
// Stores
import { mapState, mapActions } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useStepsStore from '@/stores/StepsStore';

// Helpers
import formatPrice from '@/helpers/payment/formatPrice';

// Components
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import ProgressBar from '@/components/Steps/GlobalComponents/ProgressBar/ProgressBar.vue';
import RadioButton from '@/components/Core/ActionComponents/Inputs/RadioButton/RadioButton.vue';

// Icons
import Shipping from '@/components/Core/Icons/Shipping/Shipping.vue';

// Extensions
import shippingMethods from '@/extensions/shippingMethods';
import belowShippingMethodsExtensions from '@/extensions/belowShippingMethodsExtensions';
import ageCheckerExtensions from '@/extensions/ageCheckerExtensions';
import functionExtension from '@/extensions/functionExtension';
import shippingMethodAdditionalContainers from '@/extensions/shippingMethodAdditionalContainers';

export default {
  name: 'ShippingMethod',
  components: {
    ErrorMessage,
    TextField,
    Shipping,
    MyButton,
    ProgressBar,
    RadioButton,
    ...shippingMethods(),
    ...belowShippingMethodsExtensions(),
    ...ageCheckerExtensions(),
    ...shippingMethodAdditionalContainers(),
  },
  props: {
    buttonText: {
      type: String,
      default: 'Continue to Payment',
    },
  },
  data() {
    return {
      additionalShippingMethods: [],
      belowShippingMethodsExtensions: [],
      ageCheckerExtensions: [],
      shippingMethodAdditionalContainers: [],
      hasSubmitted: false,
      shippingStepText: '',
      shippingStepTextId: 'gene-bettercheckout-shippingstep-text',
      proceedToPayText: '',
      proceedToPayTextId: 'gene-bettercheckout-proceedtopay-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'getShippingMethods']),
    ...mapState(useConfigStore, ['taxCartDisplayShipping', 'ageCheckRequired', 'ageCheckerErrors']),
    ...mapState(useCustomerStore, ['selected']),
    ...mapState(useShippingMethodsStore, [
      'getError',
      'selectedMethod',
      'shippingErrorMessage',
    ]),
  },
  async created() {
    this.additionalShippingMethods = Object.keys(shippingMethods());
    this.belowShippingMethodsExtensions = Object.keys(belowShippingMethodsExtensions());
    this.ageCheckerExtensions = Object.keys(ageCheckerExtensions());
    this.shippingMethodAdditionalContainers = Object.keys(shippingMethodAdditionalContainers());
    await this.getInitialConfig();
    this.shippingStepText = window.geneCheckout?.[this.shippingStepTextId] || this.$t('shippingStep.stepTitle');
    this.proceedToPayText = window.geneCheckout?.[this.proceedToPayTextId] || this.$t('shippingStep.proceedToPay');
  },
  async mounted() {
    await functionExtension('onShippingMethodMounted');
  },
  methods: {
    ...mapActions(useShippingMethodsStore, [
      'submitShippingInfo',
      'selectShippingMethod',
    ]),
    ...mapActions(useStepsStore, ['goToPayment']),
    ...mapActions(useConfigStore, ['getInitialConfig']),

    formatPrice(price) {
      if (price === 0) {
        return 'FREE';
      }
      return formatPrice(price);
    },

    async handleChange(item) {
      this.selectShippingMethod(item);
      await this.submitShippingInfo(item.carrier_code, item.method_code);
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
