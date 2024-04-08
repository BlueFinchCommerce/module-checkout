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

    document.addEventListener(this.orderSummaryTextId, this.setOrderSummaryText);
  },
  unmounted() {
    document.removeEventListener(this.orderSummaryTextId, this.setOrderSummaryText);
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),

    setOrderSummaryText(event) {
      this.orderSummaryText = event?.detail?.value || this.$t('orderSummary.modalHeader');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
