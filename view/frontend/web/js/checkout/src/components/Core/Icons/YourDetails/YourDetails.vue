<template>
  <img :src="detailsIconSvg" :alt="detailsIconSvg" />
</template>

<script>
import getStaticUrl from '@/helpers/getStaticPath';
import { computed, reactive } from 'vue';
import detailsIconSvg from '@/icons/detailsIcon.svg';

export default {
  name: 'YourDetails',
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
    detailsIconSvg() {
      return `${getStaticUrl(detailsIconSvg)}`;
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        width: reactiveProps.width,
        height: reactiveProps.height,
        fill: reactiveProps.fill,
        stroke: reactiveProps.stroke,
      })),
    };
  },
};
</script>
