<template>
  <div class="saved-shipping">
    <router-link
      class="saved-shipping-link"
      aria-label="proceed-to-shipping-link"
      to="/shipping"
      @click="setDetailsStepActive();"
    >
      <div class="saved-shipping__title">
        <div class="order-total">
          <div class="total__row">
            <div class="saved-shipping__icon">
              <div class="saved-shipping__icon-image">
                <Shipping fill="black"/>
              </div>
              <div class="title">
                <TextField :text="$t('shippingStep.stepCompleteTitle')"/>
              </div>
            </div>
            <div class="shipping-method-title">
              <TextField :text="`${selectedMethod.method_title}, `" />
              <Price
                class="shipping-method-value"
                :value="shippingPrice"
              />
            </div>
            <div class="proceed-to-shipping">
              <button class="button--blank edit-shipping-button"
                      :aria-label="$t('yourDetailsSection.editShippingButtonLabel')">
                <TextField class="edit-button-title" :text="$t('yourDetailsSection.editButton')"/>
                <Edit/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
// stores
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

// components
import TextField from '@/components/Core/TextField/TextField.vue';
import Price from '@/components/Core/Price/Price.vue';

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
  computed: {
    ...mapState(useCartStore, ['totalSegments', 'shippingPrice']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
  },
  methods: {
    setDetailsStepActive() {
      const element = document.getElementById('progress-bar');
      element.classList.add('shipping-active');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
