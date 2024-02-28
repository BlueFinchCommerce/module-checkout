<template>
  <div v-if="product" class="remove-item"
       data-cy="remove-item-button"
       @click="removeItem(product)"
       @keydown.enter="removeItem(product)">
    <div class="remove-item-icon">
      <Remove/>
    </div>
    <button
      class="remove-item-action button--blank"
      :aria-label="$t('orderSummary.removeItemButtonLabel')"
    >
      <TextField
        class="remove-item-copy"
        :text="$t('orderSummary.removeItemButton')"
      />
    </button>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/TextField/TextField.vue';

// stores
import { mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';

// icons
import Remove from '@/components/Core/Icons/Remove/Remove.vue';

export default {
  name: 'RemoveItemButton',
  components: {
    Remove,
    TextField,
  },
  props: {
    product: {
      type: Object,
    },
  },
  methods: {
    ...mapActions(useCartStore, ['removeItem']),
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
