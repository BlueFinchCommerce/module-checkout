<template>
  <div class="saved-shipping">
    <router-link
      class="saved-shipping-link"
      aria-label="proceed-to-shipping-link"
      data-cy="completed-step-shipping-trigger"
      to="/shipping"
      @click="setDetailsStepActive();"
    >
      <div class="saved-shipping__title">
        <div class="order-total">
          <div class="total__row">
            <div class="saved-shipping__icon">
              <div class="saved-shipping__icon-image">
                <Shipping :data-cy="'completed-step-shipping-icon'" />
              </div>
              <div class="title">
                <TextField
                  :text="shippingStepCompletedText"
                  :data-cy="'completed-step-shipping-title'"
                />
              </div>
            </div>
            <div class="shipping-method-title">
              <TextField
                :text="`${cart.shipping_addresses?.[0]?.selected_shipping_method?.method_title}, `"
                :data-cy="'completed-step-shipping-content-method'"
              />
              <Price
                class="shipping-method-value"
                :value="cart.shipping_addresses?.[0]?.selected_shipping_method?.amount?.value"
                :data-cy="'completed-step-shipping-content-price'"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="proceed-to-shipping">
        <button
          class="button--blank edit-shipping-button"
          :aria-label="$t('yourDetailsSection.editShippingButtonLabel')"
          :data-cy="'completed-step-shipping-edit-button'"
        >
          <TextField
            class="edit-button-title"
            :text="$t('yourDetailsSection.editButton')"
            :data-cy="'completed-step-shipping-edit-button-text'"
          />
          <Edit :data-cy="'completed-step-shipping-edit-icon'" />
        </button>
      </div>
    </router-link>
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
      shippingStepCompletedTextId: 'gene-bettercheckout-shippingstepcompleted-text',
    };
  },
  async created() {
    this.shippingStepCompletedText = window.geneCheckout?.[this.shippingStepCompletedTextId]
    || this.$t('shippingStep.stepCompleteTitle');

    await this.getInitialConfig();
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useStepsStore, ['goToShipping']),

    setDetailsStepActive() {
      const element = document.getElementById('progress-bar');
      element.classList.add('shipping-active');
      this.goToShipping();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
