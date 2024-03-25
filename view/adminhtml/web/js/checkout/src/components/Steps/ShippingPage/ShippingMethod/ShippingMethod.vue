<template>
  <section>
    <div class="checkout-section checkout-shipping">
      <div v-if="loadingShippingMethods">
        <Loader />
      </div>
      <ProgressBar />
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
          <div class="divider-line" />
        </div>

        <div
          v-if="cart.shipping_addresses?.[0]?.available_shipping_methods"
          class="shipping-method__container"
        >
          <template
            v-for="(item) in cart.shipping_addresses?.[0]?.available_shipping_methods"
            :key="item.carrier_code"
          >
            <label
              :for="item.method_code"
              class="shipping-method__label"
              :class="{
                'selected': (
                  item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code
                )
              }"
            >
              <template v-if="item.method_code !== nominatedId">
                <span class="shipping-method__input">
                  <input
                    :id="item.method_code"
                    :checked="item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code"
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
              </template>

              <template v-else>
                <span class="shipping-method__input">
                  <input
                    :id="nominatedId"
                    :checked="item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code"
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
              </template>
              <TextField
                class="shipping-method__price"
                :text="taxCartDisplayShipping
                  ? formatPrice(item.price_incl_tax.value)
                  : formatPrice(item.price_excl_tax.value)"
              />
              <NominatedDay
                v-if="item.carrier_code === nominatedId
                  && nominatedDayEnabled && selectedMethod.carrier_code === nominatedId"
                :item="item"
              />
            </label>
          </template>
          <component
            :is="additionalShippingMethod"
            v-for="additionalShippingMethod in additionalShippingMethods"
            :key="additionalShippingMethod"
          />
        </div>
        <TextField
          v-else-if="!cart.shipping_addresses?.[0]?.available_shipping_methods.length && !loadingShippingMethods"
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
        :disabled="!cart.shipping_addresses?.[0]?.available_shipping_methods?.length || !cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code || loadingShippingMethods"
        @click="goToPayment"
      />
    </div>
  </section>
</template>

<script>
// Stores
import { mapState, mapActions } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useStepsStore from '@/stores/StepsStore';

// Helpers
import formatPrice from '@/helpers/payment/formatPrice';

// Components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import NominatedDay from
  '@/components/Steps/ShippingPage/ShippingMethod/NominatedDay/NominatedDay.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import ProgressBar from '@/components/Steps/GlobalComponents/ProgressBar/ProgressBar.vue';

// Icons
import Loader from '@/components/Core/Icons/Loader/Loader.vue';
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
    ProgressBar,
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
    ...mapState(useCartStore, ['cart']),
    ...mapState(useConfigStore, ['taxCartDisplayShipping']),
    ...mapState(useCustomerStore, ['selected']),
    ...mapState(useShippingMethodsStore, [
      'loadingShippingMethods',
      'getError',
      'nominatedDayEnabled',
      'nominatedPrice',
      'selectedMethod',
    ]),
  },
  async created() {
    this.additionalShippingMethods = Object.keys(shippingMethods());

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
    ]),
    ...mapActions(usePaymentStore, ['setPaymentMethods']),
    ...mapActions(useStepsStore, ['goToPayment']),
    ...mapActions(useConfigStore, ['getInitialConfig']),

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
