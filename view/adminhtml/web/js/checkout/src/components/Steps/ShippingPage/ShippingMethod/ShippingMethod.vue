<template>
  <section>
    <div class="checkout-section checkout-shipping">
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
            <span
              class="shipping-method__label"
              @click="handleChange(item)"
              @keydown.enter="handleChange(item)"
              :class="{
                'selected': (
                  item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code
                )
              }"
            >
              <template v-if="item.method_code !== nominatedId">
                <span class="shipping-method__input">
                  <RadioButton
                    :id="item.method_code"
                    :checked="item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code"
                    name="shipping-option"
                  />
                </span>
                <span class="shipping-method__content">
                  <TextField :text="item.method_title" />
                  <TextField :text="item.carrier_title" />
                </span>
              </template>

              <template v-else>
                <span class="shipping-method__input">
                  <RadioButton
                    :id="nominatedId"
                    :checked="item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code"
                    name="shipping-option"
                  />
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
            </span>
          </template>
          <component
            :is="additionalShippingMethod"
            v-for="additionalShippingMethod in additionalShippingMethods"
            :key="additionalShippingMethod"
          />
        </div>
        <TextField
          v-else-if="!cart.shipping_addresses?.[0]?.available_shipping_methods.length"
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
        :disabled="!cart.shipping_addresses?.[0]?.available_shipping_methods?.length || !cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code"
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
import RadioButton from '@/components/Core/ActionComponents/Inputs/RadioButton/RadioButton.vue';

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
    RadioButton,
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
      shippingStepTextId: 'bluefinch-checkout-shippingstep-text',
      proceedToPayText: '',
      proceedToPayTextId: 'bluefinch-checkout-proceedtopay-text',
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
    ...mapState(useConfigStore, ['locale', 'taxCartDisplayShipping']),
    ...mapState(useCustomerStore, ['selected']),
    ...mapState(useShippingMethodsStore, [
      'getError',
      'nominatedDayEnabled',
      'nominatedPrice',
      'selectedMethod',
    ]),
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }

    this.additionalShippingMethods = Object.keys(shippingMethods());

    this.shippingStepText = window.bluefinchCheckout?.[this.shippingStepTextId] || this.$t('shippingStep.stepTitle');
    this.proceedToPayText = window.bluefinchCheckout?.[this.proceedToPayTextId] || this.$t('shippingStep.proceedToPay');

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
      this.shippingStepText = event?.detail?.value || this.$t('shippingStep.stepTitle');
    },
    setProceedToPayText(event) {
      this.proceedToPayText = event?.detail?.value || this.$t('shippingStep.proceedToPay');
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
