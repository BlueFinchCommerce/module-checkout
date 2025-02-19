<template>
  <div class="saved-shipping">
    <div
      class="saved-shipping-link"
      aria-label="proceed-to-shipping-link"
    >
      <div class="saved-shipping__title">
        <div class="order-total">
          <div class="total__row">
            <div class="saved-shipping__icon">
              <div class="saved-shipping__icon-image">
                <Shipping />
              </div>
              <div class="title">
                <TextField :text="shippingStepCompletedText" />
              </div>
            </div>
            <div class="shipping-method-title">
              <TextField :text="`${cart.shipping_addresses?.[0]?.selected_shipping_method?.method_title}, `" />
              <Price
                class="shipping-method-value"
                :value="cart.shipping_addresses?.[0]?.selected_shipping_method?.amount?.value"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="proceed-to-shipping">
        <button
          class="button--blank edit-shipping-button"
          :aria-label="$t('yourDetailsSection.editShippingButtonLabel')"
        >
          <TextField
            class="edit-button-title"
            :text="$t('yourDetailsSection.editButton')"
          />
          <Edit />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
// stores
import { mapState, mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import Price from '@/components/Core/ContentComponents/Price/Price.vue';

// icons
import Shipping from '@/components/Core/Icons/Shipping/Shipping.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';

export default {
  name: 'SavedShippingMethod',
  components: {
    TextField,
    Shipping,
    Price,
    Edit,
  },
  data() {
    return {
      shippingStepCompletedText: '',
      shippingStepCompletedTextId: 'bluefinch-checkout-shippingstepcompleted-text',
    };
  },
  computed: {
    ...mapState(useConfigStore, ['locale']),
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }

    this.shippingStepCompletedText = window.bluefinchCheckout?.[this.shippingStepCompletedTextId]
      || this.$t('shippingStep.stepCompleteTitle');

    document.addEventListener(this.shippingStepCompletedTextId, this.setShippingStepText);
  },
  unmounted() {
    document.removeEventListener(this.shippingStepCompletedTextId, this.setShippingStepText);
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['goToShipping']),

    setShippingStepText(event) {
      this.shippingStepCompletedText = event?.detail?.value || this.$t('shippingStep.stepCompleteTitle');
    },

    setDetailsStepActive() {
      // Commented out to prevent functionality only for UI designer
      // const element = document.getElementById('progress-bar');
      // element.classList.add('shipping-active');
      // this.goToShipping();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
