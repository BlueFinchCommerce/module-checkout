<template>
  <div class="divider">
    <div class="divider-line" />
    <TextField
      v-if="isExpressPaymentsVisible"
      :text="dividerText"
      :data-cy="'instant-checkout-divider-text'"
    />
    <TextField
      v-else
      :text="$t('payNoExpressWithBlockTitle')"
      :data-cy="'checkout-divider-text'"
    />
    <div class="divider-line" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'DividerComponent',
  components: {
    TextField,
  },
  data() {
    return {
      dividerText: '',
      dividerTextId: 'gene-bettercheckout-divider-text',
    };
  },
  computed: {
    ...mapState(useConfigStore, ['locale']),
    ...mapState(usePaymentStore, ['availableMethods', 'isExpressPaymentsVisible']),
  },
  async mounted() {
    if (!this.locale) {
      await this.getInitialConfig();
    }
    this.dividerText = window.geneCheckout?.[this.dividerTextId] || this.$t('dividerText');
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
