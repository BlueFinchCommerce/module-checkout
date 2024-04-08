<template>
  <div class="order-summary-title-amount">
    <TextField :text="orderSummaryText"/>
    <TextField text="("/>
    <TextField :text="orderItemsAmount"/>
    <TextField text=")"/>
  </div>
</template>
<script>
// stores
import { mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'OrderSummaryTitleWithAmount',
  props: ['orderItemsAmount'],
  components: {
    TextField,
  },
  data() {
    return {
      orderSummaryText: '',
      orderSummaryTextId: 'gene-bettercheckout-ordersummary-text',
    };
  },
  async created() {
    this.orderSummaryText = window.geneCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
    await this.getInitialConfig();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
