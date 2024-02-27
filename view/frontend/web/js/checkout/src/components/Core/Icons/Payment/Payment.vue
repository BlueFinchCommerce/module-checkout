<template>
  <img :src="paymentSvgIcon" :alt="paymentSvgIcon" />
</template>

<script>
import getStaticUrl from '@/helpers/getStaticPath';
import { computed, reactive } from 'vue';
import paymentSvg from '@/icons/paymentIcon.svg';

export default {
  name: 'Payment',
  props: {
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    fill: {
      type: String,
    },
    role: {
      type: String,
    },
    ariaLabel: {
      type: String,
    },
  },
  computed: {
    paymentSvgIcon() {
      return `${getStaticUrl(paymentSvg)}`;
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        width: reactiveProps.width,
        height: reactiveProps.height,
        fill: reactiveProps.fill,
      })),
    };
  },
};
</script>
