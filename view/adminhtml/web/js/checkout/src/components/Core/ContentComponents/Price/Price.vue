<template>
  <p :style="style">
    {{ formatPrice(value) }}
  </p>
</template>
<script>
import { computed, reactive } from 'vue';
// Helpers
import formatPrice from '@/helpers/payment/formatPrice';

export default {
  name: 'Price',
  props: {
    value: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    fontSize: {
      type: String,
    },
    fontWeight: {
      type: String,
    },
    fontStyle: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        fontSize: reactiveProps.fontSize,
        color: reactiveProps.color,
        fontWeight: reactiveProps.fontWeight,
        fontStyle: reactiveProps.fontStyle,
      })),
    };
  },
  methods: {
    formatPrice(price) {
      if (price === undefined) return '';

      return price < 0
        ? `-${formatPrice(Math.abs(price))}`
        : formatPrice(price);
    },
  },
};
</script>
