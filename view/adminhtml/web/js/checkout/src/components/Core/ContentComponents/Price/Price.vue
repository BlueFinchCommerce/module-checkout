<template>
  <p>
    {{ formatPrice(value) }}
  </p>
</template>
<script>
// Helpers
import formatPrice from '@/helpers/payment/formatPrice';

export default {
  name: 'Price',
  props: {
    value: {
      type: String,
      required: true,
    },
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
