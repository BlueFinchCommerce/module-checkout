<template>
  <section>
    <div class="checkout-section checkout-shipping">
      <div v-if="loadingShippingMethods">
        <Loader />
      </div>

      <div class="checkout-shipping-methods">
        <div class="checkout-shipping-methods__title">
          <div class="checkout-shipping-methods__title-icon">
            <Shipping fill="black" />
          </div>
          <div class="title">
            <TextField
              class="main-text"
              :text="shippingStepText"
            />
          </div>
          <div class="divider-line"></div>
        </div>

        <ul v-if="shippingMethods.length">
          <li
            v-for="(item) in shippingMethods"
            :key="item.carrier_code"
            class="shipping-method"
          >
            <label
              v-if="item.method_code !== nominatedId"
              :for="item.method_code"
              class="shipping-method__label"
            >
              <span class="shipping-method__input">
                <input
                  :id="item.method_code"
                  :checked="item.method_code === selectedMethod.method_code"
                  data-cy="radio-button"
                  type="radio"
                  name="shipping-option"
                  @change="handleChange(item)"
                >
              </span>
              <span class="shipping-method__content">
                <TextField :text="item.method_title" />
                <TextField :text="item.carrier_title" />
              </span>
            </label>

            <label
              v-else
              :for="nominatedId"
              class="shipping-method__label"
            >
              <span class="shipping-method__input">
                <input
                  :id="nominatedId"
                  :checked="item.method_code === selectedMethod.method_code"
                  type="radio"
                  radio-button
                  name="shipping-option"
                  @change="handleChange(item)"
                >
              </span>
              <span class="shipping-method__content">
                <TextField :text="item.method_title" />
                <TextField :text="item.carrier_title" />
              </span>
            </label>
            <TextField
              v-if="taxCartDisplayShipping"
              :text="formatPrice(item.price_incl_tax.value)"
            />
            <TextField
              v-else
              :text="formatPrice(item.price_excl_tax.value)"
            />
            <NominatedDay
              v-if="item.carrier_code === nominatedId
                && nominatedDayEnabled && selectedMethod.carrier_code === nominatedId"
              :item="item"
            />
          </li>
          <component
            :is="additionalShippingMethod"
            v-for="additionalShippingMethod in additionalShippingMethods"
            :key="additionalShippingMethod"
          />
        </ul>
        <TextField
          v-else-if="!shippingMethods.length && !loadingShippingMethods"
          class="checkout-shipping-methods__error"
          :text="$t('errorMessages.noShippingMethods')"
        />
        <span
          v-else-if="getError"
          v-html="getError"
        />
      </div>
      <MyButton
        type="submit"
        primary
        :label="proceedToPayText"
        :disabled="!shippingMethods.length || !selectedMethod.method_code || loadingShippingMethods"
        @click="checkChangedAddress();"
      />
    </div>
  </section>
</template>

<script>
// Stores
import { mapState, mapActions } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useStepsStore from '@/stores/StepsStore';

// Helpers
import formatPrice from '@/helpers/formatPrice';

// Components
import TextField from '@/components/Core/TextField/TextField.vue';
import NominatedDay from
  '@/components/Steps/ShippingPage/ShippingMethod/NominatedDay/NominatedDay.vue';
import MyButton from '@/components/Core/Button/Button.vue';

// Icons
import Loader from '@/components/Core/Loader/Loader.vue';
import Shipping from '@/components/Core/Icons/Shipping/Shipping.vue';

// Extensions
import shippingMethods from '@/extensions/shippingMethods';

export default {
  name: 'ShippingMethod',
  components: {
    TextField,
    Loader,
    Shipping,
    NominatedDay,
    MyButton,
    ...shippingMethods(),
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
      nominatedId: 'nominated_delivery',
      hasSubmitted: false,
      shippingStepText: '',
      shippingStepTextId: 'gene-bettercheckout-shippingstep-text',
      proceedToPayText: '',
      proceedToPayTextId: 'gene-bettercheckout-proceedtopay-text',
    };
  },
  computed: {
    ...mapState(useConfigStore, ['taxCartDisplayShipping']),
    ...mapState(useCustomerStore, ['selected']),
    ...mapState(useShippingMethodsStore, [
      'loadingShippingMethods',
      'getError',
      'nominatedDayEnabled',
      'nominatedPrice',
      'shippingMethods',
      'selectedMethod',
    ]),
  },
  async created() {
    this.additionalShippingMethods = Object.keys(shippingMethods());
    await this.getStoreConfig();
    this.shippingStepText = window.geneCheckout?.[this.shippingStepTextId] || this.$t('shippingStep.stepTitle');
    this.proceedToPayText = window.geneCheckout?.[this.proceedToPayTextId] || this.$t('shippingStep.proceedToPay');

    document.addEventListener(this.shippingStepTextId, this.setShippingStepText);
    document.addEventListener(this.proceedToPayTextId, this.setProceedToPayText);
  },
  unmounted() {
    document.removeEventListener(this.shippingStepTextId, this.setShippingStepText);
    document.addEventListener(this.proceedToPayTextId, this.setProceedToPayText);
  },
  methods: {
    ...mapActions(useShippingMethodsStore, [
      'submitShippingInfo',
      'selectShippingMethod',
      'setShippingMethodTitle',
      'clearSubmitShippingInfoCache',
    ]),
    ...mapActions(usePaymentStore, ['setPaymentMethods']),
    ...mapActions(useCartStore, ['getCartTotals']),
    ...mapActions(useStepsStore, ['goToPayment']),
    ...mapActions(useConfigStore, ['getStoreConfig']),

    setShippingStepText(event) {
      this.shippingStepText = event?.detail || this.$t('shippingStep.stepTitle');
    },
    setProceedToPayText(event) {
      this.proceedToPayText = event?.detail || this.$t('shippingStep.proceedToPay');
    },

    formatPrice(price) {
      if (price === 0) {
        return 'FREE';
      }
      return formatPrice(price);
    },

    async handleChange() {
      // Commented out to prevent functionality only for UI designer
      // this.selectShippingMethod(item);
      // await this.submitShippingInfo();
      // this.hasSubmitted = true;
    },

    async checkChangedAddress() {
      // Commented out to prevent functionality only for UI designer
      // if (!this.hasSubmitted) {
      //   await this.submitShippingInfo();
      //   this.hasSubmitted = true;
      // }
      // this.goToPayment();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
