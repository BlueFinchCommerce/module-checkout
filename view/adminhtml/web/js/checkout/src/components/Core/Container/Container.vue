<template>
  <div class="container">
    <div
      v-for="(column, index) in columns"
      :key="index"
      class="column"
    >
      <component
        :is="column.name"
        v-bind="column.props"
      />
    </div>
  </div>
</template>

<script>
// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import OrderSummaryDesktop
  from '@/components/Steps/GlobalComponents/OrderSummary/OrderSummaryDesktop/OrderSummaryDesktop.vue';

export default {
  name: 'Container',
  components: {
    TextField,
    OrderSummaryDesktop,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles.scss";
</style>
