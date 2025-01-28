<template>
  <div class="order-summary-title-amount">
    <TextField
      :text="orderSummaryText"
      :data-cy="dataCy ? `order-summary-title-${dataCy}` : 'order-summary-title'"
    />
    <TextField text="("/>
    <TextField
      :text="orderItemsAmount"
      :data-cy="dataCy ? `order-summary-count-${dataCy}` : 'order-summary-count'"
     />
    <TextField text=")"/>
  </div>
</template>
<script>
// stores
import { mapState, mapActions } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'OrderSummaryTitleWithAmount',
  props: {
    orderItemsAmount: {
      type: Number,
    },
    dataCy: {
      type: String,
    },
  },
  components: {
    TextField,
  },
  data() {
    return {
      orderSummaryText: '',
      orderSummaryTextId: 'bluefinch-checkout-ordersummary-text',
    };
  },
  async created() {
    if (!this.locale) {
      await this.getInitialConfig();
    }
    this.orderSummaryText = window.bluefinchCheckout?.[this.orderSummaryTextId] || this.$t('orderSummary.modalHeader');
  },
  computed: {
    ...mapState(useConfigStore, ['locale']),
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
