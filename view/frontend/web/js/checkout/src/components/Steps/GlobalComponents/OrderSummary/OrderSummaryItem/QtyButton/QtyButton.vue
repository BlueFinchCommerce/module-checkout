<template>
  <div
    v-if="item"
    class="item-qty-container"
  >
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.decreaseQuantity')"
      label=" - "
      :disabled="!canDecrease"
      @click="changeQuantity(-quantityIncrement)"
      :data-cy="dataCy ? `${dataCy}-decrease` : 'qty-component-decrease'"
    />
    <span>
      <!--  eslint-disable vue/no-mutating-props -->
      <TextInput
        :modelValue="item.quantity"
        :name="`input-qty-${item.id}`"
        :placeholder="item.quantity"
        :disabled="true"
        :data-cy="dataCy ? `${dataCy}-input` : 'qty-component-input'"
      />
    </span>
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.increaseQuantity')"
      label=" + "
      :disabled="!canIncrease"
      @click="changeQuantity(quantityIncrement)"
      :data-cy="dataCy ? `${dataCy}-increase` : 'qty-component-increase'"
    />
  </div>
</template>
<script>
// components
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';

// stores
import { mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';

export default {
  name: 'QtyButton',
  components: {
    MyButton,
    TextInput,
  },
  props: {
    item: {
      type: Object,
    },
    dataCy: {
      type: String,
    },
  },
  computed: {
    minimumQuantity() {
      return Number(this.item?.quantity_constraints?.minimum) || 1;
    },
    maximumQuantity() {
      const maximum = this.item?.quantity_constraints?.maximum;

      return maximum === null || maximum === undefined ? null : Number(maximum);
    },
    quantityIncrement() {
      return Number(this.item?.quantity_constraints?.increment) || 1;
    },
    canDecrease() {
      return Number(this.item?.quantity) - this.quantityIncrement >= this.minimumQuantity;
    },
    canIncrease() {
      return this.maximumQuantity === null
        || Number(this.item?.quantity) + this.quantityIncrement <= this.maximumQuantity;
    },
  },
  methods: {
    ...mapActions(useCartStore, ['updateQuantity']),
    changeQuantity(change) {
      if ((change < 0 && !this.canDecrease) || (change > 0 && !this.canIncrease)) {
        return;
      }

      this.updateQuantity(this.item, change);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
