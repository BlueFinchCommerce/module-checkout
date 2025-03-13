<template>
  <div v-if="product" class="remove-item"
    tabindex="0"
    @click="removeItem(product)"
    @keydown.enter="removeItem(product)"
    :data-cy="dataCy ? `${dataCy}-trigger` : 'remove-item-component-trigger'"
  >
    <div class="remove-item-icon">
      <Remove :data-cy="dataCy ? `${dataCy}-icon` : 'remove-item-component-icon'" />
    </div>
    <button
      class="remove-item-action button--blank"
      :aria-label="$t('remove item')"
      :data-cy="dataCy ? `${dataCy}-button` : 'remove-item-component-button'"
    >
      <TextField
        class="remove-item-copy"
        :text="removeItemText"
        :data-cy="dataCy ? `${dataCy}-text` : 'remove-item-component-text'"
      />
    </button>
  </div>
</template>
<script>
// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// stores
import { mapState, mapActions } from 'pinia';
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
    dataCy: {
      type: String,
    },
  },
  data() {
    return {
      removeItemText: '',
      removeItemTextId: 'bluefinch-checkout-removeitem-text',
    };
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }
    this.removeItemText = window.bluefinchCheckout?.[this.removeItemTextId] || this.$t('remove item');
  },
  computed: {
    ...mapState(useConfigStore, ['locale']),
  },
  methods: {
    ...mapActions(useCartStore, ['removeItem']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>
<style lang="scss" scoped>
@import "../styles.scss";
</style>
