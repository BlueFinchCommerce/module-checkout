<template>
  <div class="order-summary-title-amount">
    <TextField :text="$t('orderSummary.modalHeader')"/>
    <TextField text="("/>
    <TextField :text="orderItemsAmount"/>
    <TextField text=")"/>
  </div>
</template>
<script>
import TextField from '@/components/Core/TextField/TextField.vue';

export default {
  name: 'OrderSummaryTitleWithAmount',
  props: ['orderItemsAmount'],
  components: {
    TextField,
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
