<template>
  <section>
    <div class="checkout-section checkout-shipping">
      <ProgressBar />
      <div class="checkout-shipping-methods">
        <div class="checkout-shipping-methods__title">
          <div class="checkout-shipping-methods__title-icon">
            <Shipping fill="black"
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

        <div
          v-if="cart.shipping_addresses?.[0]?.available_shipping_methods
            && cart.shipping_addresses?.[0]?.available_shipping_methods.length > 0"
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
                    :data-cy="`${item.method_code}-radio-input`"
                    :id="item.method_code"
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
              </template>

              <template v-else>
                <span class="shipping-method__input">
                  <RadioButton
                    :data-cy="`${nominatedId}-radio-input`"
                    :id="nominatedId"
                    :checked="item.method_code === cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code"
                    name="shipping-option"
                  />
                </span>
                <span class="shipping-method__content">
                  <TextField
                    :text="item.method_title"
                    :data-cy="`${nominatedId}-method-title`"
                  />
                  <TextField
                    :text="item.carrier_title"
                    :data-cy="`${nominatedId}-carrier-title`"
                  />
                </span>
              </template>
              <TextField
                class="shipping-method__price"
                :text="taxCartDisplayShipping
                  ? formatPrice(item.price_incl_tax.value)
                  : formatPrice(item.price_excl_tax.value)"
                :data-cy="`${item.method_code}-price`"
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
          v-else-if="!cart.shipping_addresses?.[0]?.available_shipping_methods
          || cart.shipping_addresses?.[0]?.available_shipping_methods.length === 0"
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
        :disabled="(!cart.shipping_addresses?.[0]?.available_shipping_methods?.length
        || !cart.shipping_addresses?.[0]?.selected_shipping_method?.method_code)
        && (ageCheckRequired && ageCheckerErrors)"
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
import belowShippingMethodsExtensions from '@/extensions/belowShippingMethodsExtensions';

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
    ...belowShippingMethodsExtensions(),
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
    ...mapState(useConfigStore, ['taxCartDisplayShipping', 'ageCheckRequired', 'ageCheckerErrors']),
    ...mapState(useCustomerStore, ['selected']),
    ...mapState(useShippingMethodsStore, [
      'getError',
      'nominatedDayEnabled',
      'nominatedPrice',
      'selectedMethod',
    ]),
  },
  async created() {
    this.additionalShippingMethods = Object.keys(shippingMethods());
    this.belowShippingMethodsExtensions = Object.keys(belowShippingMethodsExtensions());
    await this.getInitialConfig();
    this.shippingStepText = window.geneCheckout?.[this.shippingStepTextId] || this.$t('shippingStep.stepTitle');
    this.proceedToPayText = window.geneCheckout?.[this.proceedToPayTextId] || this.$t('shippingStep.proceedToPay');
  },
  methods: {
    ...mapActions(useShippingMethodsStore, [
      'submitShippingInfo',
      'selectShippingMethod',
    ]),
    ...mapActions(usePaymentStore, ['setPaymentMethods']),
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
