<template>
  <img :src="deliverySvgIcon" :alt="deliverySvgIcon" />
</template>

<script>
import { computed, reactive } from 'vue';
import getStaticUrl from '@/helpers/getStaticPath';
import deliverySvg from '@/icons/delivery.svg';

export default {
  name: 'Locate',
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
    deliverySvgIcon() {
      return `${getStaticUrl(deliverySvg)}`;
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
