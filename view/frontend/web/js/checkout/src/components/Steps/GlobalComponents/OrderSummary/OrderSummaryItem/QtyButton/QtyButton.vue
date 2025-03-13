<template>
  <div
    v-if="item"
    class="item-qty-container"
  >
    <MyButton
      :primary="false"
      :aria-label="$t('minus one item')"
      label=" - "
      @click="item.quantity === 1 ? false : updateQuantity(item, -1)"
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
      :aria-label="$t('plus one item')"
      label=" + "
      @click="updateQuantity(item, 1)"
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
  methods: {
    ...mapActions(useCartStore, ['updateQuantity']),
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
