<template>
  <div
    v-if="item"
    class="item-qty-container"
  >
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.minusOneItem')"
      data-cy="qty-decrease"
      label=" - "
      @click="item.quantity === 1 ? false : updateQuantity(item, -1)"
    />
    <span>
      <!--  eslint-disable vue/no-mutating-props -->
      <TextInput
        :modelValue="item.quantity"
        :name="`input-qty-${item.id}`"
        data-cy="qty-input"
        :placeholder="item.quantity"
        :disabled="true"
      />
    </span>
    <MyButton
      :primary="false"
      :aria-label="$t('orderSummary.plusOneItem')"
      data-cy="qty-increase"
      label=" + "
      @click="updateQuantity(item, 1)"
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
  },
  methods: {
    ...mapActions(useCartStore, ['updateQuantity']),
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
