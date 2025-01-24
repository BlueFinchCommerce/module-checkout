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
        :text="removeItemText"
      />
    </button>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// stores
import { mapActions } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

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
  data() {
    return {
      removeItemText: '',
      removeItemTextId: 'bluefinch-checkout-removeitem-text',
    };
  },
  async created() {
    this.removeItemText = window.bluefinchCheckout?.[this.removeItemTextId] || this.$t('orderSummary.removeItemButton');

    document.addEventListener(this.removeItemTextId, this.setRemoveItemText);
  },
  unmounted() {
    document.removeEventListener(this.removeItemTextId, this.setRemoveItemText);
  },
  methods: {
    ...mapActions(useCartStore, ['removeItem']),
    ...mapActions(useConfigStore, ['getInitialConfig']),

    setRemoveItemText(event) {
      this.removeItemText = event?.detail || this.$t('orderSummary.removeItemButton');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
