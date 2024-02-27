<template>
  <img :src="shippingSvgIcon" :alt="shippingSvgIcon" />
</template>

<script>
import getStaticUrl from '@/helpers/getStaticPath';
import { computed, reactive } from 'vue';
import shippingSvg from '@/icons/shippingIcon.svg';

export default {
  name: 'Shipping',
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
    shippingSvgIcon() {
      return `${getStaticUrl(shippingSvg)}`;
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
