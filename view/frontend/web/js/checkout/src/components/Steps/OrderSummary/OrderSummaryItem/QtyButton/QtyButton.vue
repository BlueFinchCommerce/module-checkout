<template>
  <div
    v-if="product"
    class="item-qty-container"
  >
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.minusOneItem')"
      data-cy="qty-decrease"
      label=" - "
      @click="product.qty === 1 ? false : updateQuantity(product, -1)"
    />
    <label :for="`input-qty-${product.item_id}`">
      <!--  eslint-disable vue/no-mutating-props -->
      <input
        v-model="product.qty"
        :name="`input-qty-${product.item_id}`"
        data-cy="qty-input-"
        type="text"
        disabled
        :placeholder="product.qty"
      >
    </label>
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.plusOneItem')"
      data-cy="qty-increase"
      label=" + "
      @click="updateQuantity(product, 1)"
    />
  </div>
</template>
<script>
// components
import MyButton from '@/components/Core/Button/Button.vue';

// stores
import { mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';

export default {
  name: 'QtyButton',
  components: {
    MyButton,
  },
  props: {
    product: {
      type: Object,
    },
  },
  methods: {
    ...mapActions(useCartStore, ['updateQuantity']),
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
