<template>
  <div
    v-if="product"
    class="item-qty-container"
  >
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.minusOneItem')"
      label=" - "
      @click="product.qty === 1 ? false : updateQuantity(product, -1)"
    />
    <label :for="`input-qty-${product.item_id}`">
      <!--  eslint-disable vue/no-mutating-props -->
      <input
        v-model="product.qty"
        :name="`input-qty-${product.item_id}`"
        type="text"
        disabled
        :placeholder="product.qty"
      >
    </label>
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.plusOneItem')"
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
